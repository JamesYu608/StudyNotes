# Docker Cheat Sheet

# 資訊
* 整體資訊

```bash
docker info
```

## Images
* Local的所有images

```bash
docker images
```

* Image Layers

```bash
docker history REPOSITORY:TAG
# docker history busybox:1.24
```

* 建立TAG，reference到指定的image id

```bash
docker tag IMAGE_ID REPOSITORY:TAG
# docker tag 093adf269ad6 local/debian:1.01
```

## Containers
* 看low level的container資訊

```bash
docker inspect CONTAINER_ID
```

* 正在run的containers

```bash
docker ps
docker ps -a # 全部，包括exit的
docker ps -q # 只顯示ID
# --no-trunc: 不截斷
```

* 看log (e.g. container用`-d`在background run)

```bash
docker logs CONTAINER_ID
```

## Network
* 查看host machine上的network資訊

```bash
docker network ls
```

* 特定network的詳細資訊

```bash
docker network inspect bridge
# Subnet": "172.17.0.0/16，表示IP range為172.17.0.0 ~ 172.17.255.255
```

# Run Image
* Scheme

```bash
docker run REPOSITORY:TAG COMMAND [args]
# docker run busybox:1.24 echo "Hello, world!"
```

或是

```bash
docker run IMAGE_ID COMMAND [args]
```

* 互動模式 + stdin / stdout

```bash
# -i: Starts an interactive container
# =t: Creates a pseudo-TTY that attaches stdin and stdout
docker run -i -t busybox:1.24
```

* `--link`: 連結到其它container

```bash
docker run -d --name redis redis:3.2.0 # 先把redis的container run起來，就取名叫redis
docker run -d -p 5000:5000 --link redis dockerapp:v0.3 # 在dockerapp的/etc/hosts建立一個link到redis
```

這邊簡單建立單一link從recipient到source container，若是有多個containers要link的複雜case，使用[compose](#compose)

* `--net`: 選擇container的[network](#network)型態，default為bridge
* `-d` (**重要**): Detached mode
* `--publish, -p`: Publish a container's port(s) to the host
* `--name`: 若沒有指定會隨機命名container
* `-rm`: Exit時remove container
* `--restart`: Restart policy to apply when a container exits

### exec
在runinng的container上執行指令，例如

```bash
docker exec -it CONTAINER_ID bash
```

Additionl: [ps aux](http://linux.vbird.org/linux_basic/0440processcontrol.php#ps_aux)

### 停止 & 移除所有containers
```bash
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
```

# Build Image
## 1. 從現有的container commit
```bash
docker commit CONTAINER_ID REPOSITORY:TAG
# docker commit 582d04e6259d local/debian:1.00
```

## 2. 從Dockerfile
```bash
# -t: Name and optionally a tag (Name:Tag)
# -f: Name of the Dockerfile (Default is 『PATH/Dockerfile')
docker build PATH
# docker build -t local/debian .
```

### Dockerfile
```bash
FROM debian:jessie # FROM永遠是第一個instruction
RUN apt-get update
RUN apt-get install -y git
RUN apt-get install -y vim
```

**Tips - Chain Instrcutions:**

```bash
FROM debian:jessie
RUN apt-get update && apt-get install -y \
    git \
    vim
```

#### `CMD`
```bash
FROM debian:jessie
RUN apt-get update && apt-get install -y \
    git \
    vim
CMD ["echo", "hello world"] # 一個Dockerfile只能有一個，沒指定的話使用base image的
```

#### `COPY` (只能複製local file，**優先使用**)
```bash
COPY abc.txt /src/abc.txt
```

另外有一個指定`ADD`，可以下載remote file，甚至unpack，若`COPY`不夠才用

#### `USER` (**建議一率要切換user，不然預設的user是root**)
```bash
RUN useradd -ms /bin/bash admin
USER admin # 切換到admin這個user
```

Additonal: [useradd](http://linux.vbird.org/linux_basic/0410accountmanager.php#useradd)

#### `WORKDIR`
若不存在，會建立

### Remove Images
```bash
docker rmi IMAGE_ID
```

# <a name="compose"></a>Docker Compose
### docker-compose.yml
```bash
version: '2' # version 2支援networking features
services:
  dockerapp:
    build: . # 由於Dockerfile在同一folder，使用.
    ports: # host port : container port
      - "5000:5000"
    volumes: # host directory: container directory
      - ./app:/app

  redis:
    image: redis:3.2.0 # run image
    
# 用compose方式不需要再宣告`--link`，會自動scan所有services (containers)名稱然後建立link
```

#### `volumes`
讓host machine可以跟container建立folder連結
    
以上面例子而言，container在執行時的`/app` folder，會指到host machine的`./app` folder

所以不需在Dockerfile中使用`COPY`


### Commands
* 執行
    * `up`
    
    ```bash
    docker-compose up # 可以加-d，在detached mode執行
    # 會建立一個network，預設類型為bridge
    ```
    
    * `run` (在`up`之後)

    ```bash
    docker-compose run dockerapp # 一次性的run compose中的特定service (也可用exec辦到)
    # Example: Override該service的default command來做unit test
    docker-compose run dockerapp python test.py
    ```

* `docker-compose ps`: 列出所有containers的狀態
* `docker-compose logs`: Compose-managed containers的log
* `docker-compose logs -f`: 當log有增加的時候才output到console
* `docker-compose logs CONTAINER_NAME`: 特定container的log
* `docker-compose stop`: 停止所有containers
* `docker-compose rm`: 移除所有containers
* `docker-compose down`: stop + rm + 移除network
* `docker-compose build`: Build所有containers (因為修改image或Dockerfile時，並不會自動rebuild containers)

## `extends`
```bash
# docker-compose.yml (測試)
version: '2'
services:
  dockerapp:
    build: .
    ports:
      - "5000:5000"

  redis:
    image: redis:3.2.0
    
# prod.yml (發佈)
version: '2'
services:
  dockerapp:
    image: jamesyu608/dockerapp # 只差在這行，重複性太高
    ports:
      - "5000:5000"

  redis:
    image: redis:3.2.0
```

使用`extends`來refactor

```bash
# common.yml
version: '2'
services:
  dockerapp:
    ports:
      - "5000:5000"

  redis:
    image: redis:3.2.0
```

```bash
# docker-compose.yml (測試)
version: '2'
services:
  dockerapp:
    extends:
      file: common.yml
      service: dockerapp
    build: . # 沒有包含在common.yml中，還是要寫

  redis:
    extends:
      file: common.yml
      service: redis

# prod.yml (發佈)
version: '2'
services:
  dockerapp:
    extends:
      file: common.yml
      service: dockerapp
    image: jamesyu608/dockerapp

  redis:
    extends:
      file: common.yml
      service: redis
```

# <a name="network"></a>Docker Network
初始狀態:

```bash
docker network ls

NETWORK ID          NAME                DRIVER              SCOPE
100953579e25        bridge              bridge              local
f2c2a99d22fb        host                host                local
c6493b5d1156        none                null                local
```

## None
```bash
docker run -d --net none busybox sleep 1000
```

```bash
/ # ping 8.8.8.8 (連不到)
PING 8.8.8.8 (8.8.8.8): 56 data bytes
ping: sendto: Network is unreachable

/ # ifconfig (只有一個network interface: local loopback)
lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
```

Additional: [ifconfig](http://linux.vbird.org/linux_server/0140networkcommand.php#ifconfig)

### Conclusion
* 安全性最高
* 有網路連線需求不適用

## Bridge
Containers沒有特別指定`--net`的話，就是跑在初始化時建立的`bridge` network

```bash
docker network inspect bridge

"Subnet": "172.17.0.0/16" # IP range: 172.17.0.0 ~ 172.17.255.255
```

### 建立兩個containers，使用預設的`bridge` network
```bash
# 建立container_1
docker run -d --name container_1 busybox sleep 1000

# ifconfig
docker exec -it container_1 ifconfig
eth0      Link encap:Ethernet  HWaddr 02:42:AC:11:00:02 # 可以連到外部，以及同一bridge的containers
          inet addr:172.17.0.2  Bcast:0.0.0.0  Mask:255.255.0.0 # 分配到172.17.0.2

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
```

```bash
# 建立container_2
docker run -d --name container_2 busybox sleep 1000

# ifconfig
docker exec -it container_2 ifconfig
eth0      Link encap:Ethernet  HWaddr 02:42:AC:11:00:03
          inet addr:172.17.0.3  Bcast:0.0.0.0  Mask:255.255.0.0 # 分配到172.17.0.3

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
```

#### 1. 連到外部
```bash
# 從container_1到google
docker exec -it container_1 ping 8.8.8.8
PING 8.8.8.8 (8.8.8.8): 56 data bytes
64 bytes from 8.8.8.8: seq=0 ttl=37 time=0.378 ms
64 bytes from 8.8.8.8: seq=1 ttl=37 time=0.566 ms
...
```

#### 2. 連到同一bridge的containers
```bash
# 從container_1連container_2
docker exec -it container_1 ping 172.17.0.3
PING 172.17.0.3 (172.17.0.3): 56 data bytes
64 bytes from 172.17.0.3: seq=0 ttl=64 time=0.124 ms
64 bytes from 172.17.0.3: seq=1 ttl=64 time=0.123 ms
...
```

### 建立初始化以外的另一個`bridge` network
* 建立network

```bash
# --driver: 指定network type
docker network create --driver bridge my_bridge_network

docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
100953579e25        bridge              bridge              local
f2c2a99d22fb        host                host                local
b663b2801240        my_bridge_network   bridge              local # 新建的
c6493b5d1156        none                null                local
```

```bash
docker network inspect my_bridge_network

"Subnet": "172.18.0.0/16", # IP range: 172.18.0.0 ~ 172.18.255.255
```

* 建立container使用新network

```bash
# 建立container_3
docker run -d --name container_3 --net my_bridge_network busybox sleep 1000

# ifconfig
docker exec -it container_3 ifconfig
eth0      Link encap:Ethernet  HWaddr 02:42:AC:12:00:02
          inet addr:172.18.0.2  Bcast:0.0.0.0  Mask:255.255.0.0 # 注意這邊，分配到172.18的區段

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
```

#### 連到不同bridge的containers (不可)
```bash
# 從container_3連container_1
docker exec -it container_3 ping 172.17.0.2
PING 172.17.0.2 (172.17.0.2): 56 data bytes
```

### 將container增加不同bridge的connect
```bash
# 在container_3新增連線到bridge (初始化時的bridge network)
docker network connect bridge container_3

# ifconfig
docker exec -it container_3 ifconfig
eth0      Link encap:Ethernet  HWaddr 02:42:AC:12:00:02 # 原來的，my_bridge_network區段
          inet addr:172.18.0.2  Bcast:0.0.0.0  Mask:255.255.0.0

eth1      Link encap:Ethernet  HWaddr 02:42:AC:11:00:02 # 新增加的，可以連到bridge區段
          inet addr:172.17.0.2  Bcast:0.0.0.0  Mask:255.255.0.0

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
```

再連一次 (可以):

```bash
# 從container_3連container_1
docker exec -it container_3 ping 172.17.0.2
PING 172.17.0.2 (172.17.0.2): 56 data bytes
64 bytes from 172.17.0.2: seq=0 ttl=64 time=0.074 ms
...
# 從container_3連container_2
docker exec -it container_3 ping 172.17.0.3
PING 172.17.0.3 (172.17.0.3): 56 data bytes
64 bytes from 172.17.0.3: seq=0 ttl=64 time=0.074 ms
...
```

#### Remove connect
```bash
# 將container_3對bridge的連線移除掉
docker network disconnect bridge container_3
docker exec -it container_3 ifconfig
eth0      Link encap:Ethernet  HWaddr 02:42:AC:12:00:02 # 剩本來的
          inet addr:172.18.0.2  Bcast:0.0.0.0  Mask:255.255.0.0

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
```

### Conclusion
* 每個container有兩個network interface
    * Loopback interface: 同none
    * Private interface: 連到該bridge network的host，**可以連線同一bridge的containers或外部網路**
* 預設不同bridge network的containers彼此不能連線，不過可以透過`connect`來設定
* 犧牲了一點安全性來對外部做連線，適用於建立單一host上的小型網路

## Host (不建議)
```bash
docker run -d --name container_4 --net host busybox sleep 1000

# ifconfig
docker exec -it container_4 ifconfig # 可以access整個host的network
br-b663b2801240 Link encap:Ethernet  HWaddr 02:42:FF:D3:C9:FF
          inet addr:172.18.0.1  Bcast:0.0.0.0  Mask:255.255.0.0

docker0   Link encap:Ethernet  HWaddr 02:42:C3:F5:C9:08
          inet addr:172.17.0.1  Bcast:0.0.0.0  Mask:255.255.0.0

eth0      Link encap:Ethernet  HWaddr C0:FF:EE:C0:FF:EE
          inet addr:192.168.65.2  Bcast:192.168.65.7  Mask:255.255.255.248

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
```

### Conclusion
* 最低安全性
* Performance最好，不需要額外的IP mappings

## Overlay
以上三種都是單一host的架構，overlay network支援multi-host networking

大多production的機制都是這樣做，之後會再詳談

## Networks with Docker Compose
預設會建立一個bridge network讓compose中的containers使用，若需要customize:

```bash
version: '2'
services:
  proxy:
    build: ./proxy
    networks:
      - front
    
  app:
    build: ./app
    networks:
      - front
      - back

  db:
    image: postgres
    networks:
      - back

networks:
  front:
    # Use a custom driver
    driver: custom-driver-1
  back:
    # Use a custom driver which takes special options
    driver: custom-driver-2
    driver_opts:
      foo: "1"
      bar: "2"
```

# DockerHub
Remote Image PATH: `docker_hub_id/repository_name`

#### Step 1: Login
```bash
docker login --username=USER_NAME
```

#### Step 2: Push
```bash
docker push REPOSITORY:TAG
```

# CircleCI
`circle.yml`

```bash
machine: # 設定CI server上的VM configuration
  pre:
    - curl -sSL https://s3.amazonaws.com/circle-downloads/install-circleci-docker.sh | bash -s -- 1.10.0
  services:
    - docker

dependencies: # 安裝docker-compose
  pre:
    - sudo pip install docker-compose

test:
  override: # Override circle的預設commands
    - docker-compose up -d
    - docker-compose run dockerapp python test.py
```

Additionl: [如何只build特定branch?](https://discuss.circleci.com/t/how-to-build-only-specific-branches/637/2)

### Docker
#### 1. CircleCI:
Build Setting -> Environment Variables -> 

* `DOCKER_HUB_EMAIL`
* `DOCKER_HUB_PWD`
* `DOCKER_HUB_USER_ID`

#### 2. circle.yml
```bash
deployment:
  hub:
    branch: [circle_ci_publish, master]
    commands:
      - docker login -e $DOCKER_HUB_EMAIL -u $DOCKER_HUB_USER_ID -p $DOCKER_HUB_PWD
      - docker tag dockerapp_dockerapp $DOCKER_HUB_USER_ID/dockerapp:$CIRCLE_SHA1
      - docker tag dockerapp_dockerapp $DOCKER_HUB_USER_ID/dockerapp:latest
      - docker push $DOCKER_HUB_USER_ID/dockerapp:$CIRCLE_SHA1
      - docker push $DOCKER_HUB_USER_ID/dockerapp:latest
  release: # Just for example
    branch: ...
    commands: ...
```

`hub`是自己取的，`branch`的部份表示若**當前changes**是上在這兩個branches之一，則執行下面的`commands`

在`commands`中，將最新的`dockerapp_dockerapp` image，分別上兩個tag:

* 一個表示當前版本(這邊使用CIRCLE_SHA1當版號)
* 一個表示最新(latest)

然後push到DockerHub

Additional: 若不想檢查當前change所在的branch，設成所有branches: `branch: /.*/` (**不要在production做這件事**)

#### 3. 到DockerHub查看images
`jamesyu608/dockerapp`

Tag Name:

* latest
* 5806fdf7fd6fb7795b886e54726074733e5115b7

# Docker Machine
已經安裝在docker for mac中

* 版本

```bash
docker-machine version
```

* 查看

```bash
docker-machine ls
```

* **在remote建立**docker machine，然後我們作為client (只是把本來用的docker machine從local host變成remote的)

```bash
# --driver: 由provider提供，例如VirtualBox、AWS...
# 最後一個參數為machine name，自訂
docker-machine create --driver digitalocean --digitalocean-access-token <xxxxx> docker-app-machine
```

用`docker info`查看，可以看到這個docker machine的status，它是Ubuntu、 500M的RAM...etc.

* 查看remote docker machine的環境變數，並且在local設定 (切換到remote host)

```bash
docker-machine env docker-app-machine

export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://45.55.73.145:2376"
export DOCKER_CERT_PATH="/Users/james_yu/.docker/machine/machines/docker-app-machine"
export DOCKER_MACHINE_NAME="docker-app-machine"
# Run this command to configure your shell:
# eval $(docker-machine env docker-app-machine)
```

Additional: [eval](http://linux.vbird.org/linux_basic/0320bash/0320bash.php#eval)

* 將docker-machine換回local host

```bash
docker-machine env -u

unset DOCKER_TLS_VERIFY
unset DOCKER_HOST
unset DOCKER_CERT_PATH
unset DOCKER_MACHINE_NAME
# Run this command to configure your shell:
# eval $(docker-machine env -u)
```

### ReAttach已經在run的remote container
查看`~/.ssh/id_rsa.pub`，新增到digitalocean的Security -> SSH keys

```bash
docker-machine create \
    --driver generic \
    --generic-ip-address=45.55.73.145 \
    --generic-ssh-key ~/.ssh/id_rsa \ # 這邊不用加.pub，會自動加
    docker-app-machine
```

### Publish Image
`prod.yml`

```bash
version: '2'
services:
  dockerapp:
    image: jamesyu608/dockerapp # 改這行，從build變成image，然後指到DockerHub上的latest
    ports:
      - "5000:5000"

  redis:
    image: redis:3.2.0
```

```bash
docker-compose -f prod.yml up -d
```

# Docker Swarm
注意 (下面教學可能過時):

Docker now allows orchestrating swarm without setting up counsel

by simply using `docker swarm init` and `docker swarm join`.

It would also be great to update this tutorial to version 3 of the yml config.

## 1. Provision a consul machine and run consul server on top of it as a key value store for service discovery
#### Prev: Expose environment variables
```bash
# 單純為了之後方便
export DIGITALOCEAN_ACCESS_TOKEN=<YOUR_DIGITALOCEAN_TOKEN>
export DIGITALOCEAN_PRIVATE_NETWORKING=true # host和swarm可以彼此access，但外部不能access它們
export DIGITALOCEAN_IMAGE=debian-8-x64 # OS image
```

#### Step 1: 建立一個docker machine，用來做為service discovery (Implemenation: consul)
```bash
docker-machine create -d digitalocean consul # 這邊consul單純為machine name
```

* 查看網路設定

```bash
# docker-machine ssh: 在docker machine上使用SSH來執行command
docker-machine ssh consul ifconfig

# Bridge network
docker0   Link encap:Ethernet  HWaddr 02:42:15:02:18:f7
          inet addr:172.17.0.1  Bcast:0.0.0.0  Mask:255.255.0.0

# 跟外部網路的連線 (我們可以透過138.197.69.14來連到這個container)
eth0      Link encap:Ethernet  HWaddr 02:0a:d0:5a:0f:d9
          inet addr:138.197.69.14  Bcast:138.197.79.255  Mask:255.255.240.0

# Private Networking (上面我們有設定)，我們用來保護key / value store不被外部網路存取
eth1      Link encap:Ethernet  HWaddr 56:46:d4:86:a4:37
          inet addr:10.132.107.230  Bcast:10.132.255.255  Mask:255.255.0.0
...
```

* 驗證一下，`ping`看看

```bash
# 從local去ping eth0的IP: 成功
ping -c 1 $(docker-machine ssh consul 'ifconfig eth0 | grep "inet addr:" | cut -d: -f2 | cut -d" " -f1')
# 從local去ping eth1的IP: 失敗
ping -c 1 $(docker-machine ssh consul 'ifconfig eth1 | grep "inet addr:" | cut -d: -f2 | cut -d" " -f1')
```

* 為了方便，把`eth1`的IP設到環境變數

```bash
export KV_IP=$(docker-machine ssh consul 'ifconfig eth1 | grep "inet addr:" | cut -d: -f2 | cut -d" " -f1')
```

#### Step 2: 在docker machine上run consul container
記得先切client連到剛建立的docker machine

```bash
eval $(docker-machine env consul)
docker-machine ls

NAME                 ACTIVE   DRIVER         STATE     URL                        SWARM   DOCKER        ERRORS
consul               *        digitalocean   Running   tcp://138.197.69.14:2376           v17.03.0-ce
docker-app-machine   -        generic        Running   tcp://45.55.73.145:2376            v17.03.0-ce
```

Run

```bash
# -bootstrap: 是gliderlabs/consul-server的參數，適用於第一次建立cluster
# 這邊用的似乎不是官方的consul-server image...
docker run -d -p ${KV_IP}:8500:8500 --restart always gliderlabs/consul-server -bootstrap
```

## 2. Provision a Docker Swarm master node
```bash
docker-machine create -d digitalocean --swarm \
  --swarm-master \ # 表示此machine為swarm master
  --swarm-discovery="consul://${KV_IP}:8500" \ # 重要: consul endpoint，剛才建立的docker machine
  --engine-opt="cluster-store=consul://${KV_IP}:8500" \ # 設flag: cluster-store
  --engine-opt="cluster-advertise=eth1:2376" \ # 設flag: cluster-advertise
  master
```
## 3. Provision a Docker Swarm slave node
我們可以建立多個slave nodes，這邊建立一個當例子

```bash
# 去掉--swarm-master
docker-machine create -d digitalocean --swarm \
  --swarm-discovery="consul://${KV_IP}:8500" \
  --engine-opt="cluster-store=consul://${KV_IP}:8500" \
  --engine-opt="cluster-advertise=eth1:2376" \
  slave
```

將client切到master，然後看資訊

```bash
eval $(docker-machine env -swarm master)
docker info
Containers: 3
 Running: 3

Nodes: 2
 master: 138.197.77.11:2376
  └ Containers: 2 (2 Running, 0 Paused, 0 Stopped)provider=digitalocean, storagedriver=aufs
 slave: 138.197.72.120:2376
  └ Containers: 1 (1 Running, 0 Paused, 0 Stopped)provider=digitalocean, storagedriver=aufs
```

有三個containers run在master的原因是

```bash
docker ps -a
CONTAINER ID        IMAGE               COMMAND                        NAMES
7493b3bbc88a        swarm:latest        "/swarm join --adv..."         slave/swarm-agent
0da583bbcc73        swarm:latest        "/swarm join --adv..."         master/swarm-agent
19030299893b        swarm:latest        "/swarm manage --t..."         master/swarm-agent-master
```

可以看到master同時是swarm agent以及node

## 4. Define the overlay network to support multi-host networking
修改`prod.yml`

```bash
version: '2'
services:
  dockerapp:
    extends:
      file: common.yml
      service: dockerapp
    image: jleetutorial/dockerapp
    depends_on: # 這之前就要加了，確保redis先起來 (之前有時候dockerapp在redis前先起來，會error)
      - redis
    networks:
      - mynet
    environment:
      - constraint:node==master # 指定dockerapp要跑在master node

  redis:
    extends:
      file: common.yml
      service: redis
    networks:
      - mynet

networks:
  mynet:
    driver: overlay # Overlay Network，允許multi host
```
## 5. Deploy our Docker app services on the Swarm cluster via Docker compose
Deploy

```bash
docker-compose -f prod.yml up -d
Creating network "dockerapp_mynet" with driver "overlay"
```

Check

```bash
docker ps
CONTAINER ID        IMAGE                    COMMAND                  CREATED             STATUS              PORTS                          NAMES
1bad5b8f7a07        jleetutorial/dockerapp   "python app.py"          9 seconds ago       Up 5 seconds        138.197.77.11:5000->5000/tcp   master/dockerapp_dockerapp_1
192c53270a0e        redis:3.2.0              "docker-entrypoint..."   11 seconds ago      Up 8 seconds        6379/tcp                       slave/dockerapp_redis_1
```
