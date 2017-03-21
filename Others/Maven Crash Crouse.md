# Maven Crash Crouse
簡單筆記一下

課程連結: [(Udemy) Maven Crash Crouse](https://www.udemy.com/mavencrashcourse/learn/v4/content)

參考資訊:

* [openhome.cc](https://openhome.cc/Gossip/JUnit/Maven.html)

## 建project
```bash
# archetype:generate: Goal
# -DgroupId: Package
# -DartifactId: Project name
$ mvn archetype:generate -DgroupId=com.bharath -DartifactId=hellomaven
-DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

#### `pom.xml`
```bash
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
  <modelVersion>4.0.0</modelVersion> # POM版本
  # -------- 這四個重要: Maven Coordinates
  <groupId>com.bharath</groupId>
  <artifactId>hellomaven</artifactId>
  <packaging>jar</packaging>
  <version>1.0-SNAPSHOT</version>
  # --------
  <name>hellomaven</name>
  <url>http://maven.apache.org</url> # 隨便
  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>3.8.1</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
```

## Build
```bash
mvn install
# 在IDEA: 右邊Maven Projects -> Execute Maven Goals (按鈕) -> Command: install
```

`/target`跑出來，有`/classes` folder以及`hellomaven-1.0-SNAPSHOT.jar`

```bash
# 跑jar檔中的class
$ java -cp target/hellomaven-1.0-SNAPSHOT.jar com.bharath.App
Hello World!
```

## Plugins and Goals
一個plugin是多個goals的collection，例如:

```bash
# pluginId:goalId
$ mvn archetype:generate ...參數
# 執行archetype這個plugin的generate這個goal

$ mvn install:install ...參數
# 執行install這個plugin的install這個goal
```

Goals可以被視為tasks，例如`compile`、`test`、`package`

Maven預設使用plugins: `compiler` -> `jar` -> `war`來打包，但可以透過`pom.xml` override打包過程


## Life Cycle (Phases)
[參考](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html): 總共有三種: `default` / `clean` / `site`

以default為例，其中包括以下階段:

* validate: 
* compile: 編譯
* test: 
* package: 產生jar檔
* verify
* install: 安裝jar檔到local repository
* deploy

所以`mvn install`的意思: 依照life cycle的順序，依序執行到`install` phase

Additional: 

* [參考](http://stackoverflow.com/questions/32006351/intellij-idea-14-how-to-skip-tests-while-deploying-project-into-tomcat): 在IDEA中，可以用閃電符號skip掉`test`階段

    這樣在run`package`或`install`的時候就不會做測試 (要用IDEA的run，terminal的話不會起作用)
    
* [參考](https://openhome.cc/Gossip/JUnit/BuildLifeCycle.html): 一次執行多個幾段，例如`mvn clean package`    

### clean (不在life cycle中)
`mvn clean`: 砍掉`/target`

## Goals
每個phase是由一系列的goals組合起來的

以`mvn install` + `<packaging>jar</packaging>`為例，會將下列goals bind到phases:

* Phase: `process-resources` / Goal: `resources:resources`
* Phase: `compile` / Goal: `compiler:compile`
* Phase: `test` / Goal: `surefire:test`
* Phase: `package` / Goal: `jar:jar`

## Maven Coordinates
`groupId:artifactId:packaging:version`:

* `groupId`: `com.oracle`, `org.apache`, `com.youcompany`, ...etc.
* `artifactId` (groupId的subset): `hellomaven`, `junit`, ...etc.
* `version`: `1.0-SNAPSHOT`, `2.0.3`
* `packaging`: `jar` (預設), `war`, ...etc.

## Maven Repositories
* [Maven central repository](http://repo.maven.apache.org/maven2/):

`Jar` plugin, `War` plguin, `junit.jar`, `mysql.jar`, ...etc.

```bash
# http://repo.maven.apache.org/maven2/junit/junit/3.8.1/
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>3.8.1</version>
</dependency>
```

* Enterprise repository

```bash
<dependency>
 <groupId>com.oracle.jdbc</groupId>
 <artifactId>ojdbc7</artifactId>
 <version>12.1.0.2</version>
</dependency>
```

* Local repository: `~/.m2/repository/` (裡面有剛才的hellomaven project)

## Apache Maven Compiler Plugin – Usage
[Ref](https://maven.apache.org/plugins/maven-compiler-plugin/usage.html)

### Effective POM
IDEA: Maven -> Show Effective POM

我的理解是每個pom都自動繼承super pom，所以我們只需在其中宣告必要以及需要override的東西，其它都從super pom繼承

Show Effective POM則是可以看出該pom包括繼承來的內容的最終結果

```bash
...
<plugin>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.1</version>
...
```

### 在`pom.xml`加入
在`compile`階段預設就會使用`maven-compiler-plugin`，我們現在要override它的一些設定

```bash
<build>
<plugins>
  <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.2</version>
    <configuration>
      <!-- put your configurations here -->
      <source>1.8</source>
      <target>1.8</target>
    </configuration>
  </plugin>
</plugins>
</build>
```

## Junit Dependency & Testing
[Maven Junit Dependency](https://mvnrepository.com/artifact/junit/junit)

* 把`pom.xml`的junit換成

```bash
<dependency>
  <groupId>junit</groupId>
  <artifactId>junit</artifactId>
  <version>4.4</version>
</dependency>
```

[IDEA: create test](https://www.jetbrains.com/help/idea/2016.3/create-test.html)

然後下`mvn install`

### Skip test
```bash
$ mvn install -DskipTests
...
[INFO] Tests are skipped.
...
```

#### IDEA
* Edit Configuration -> Parameters -> Command Line: `install`
* Edit Configuration -> Runner -> Skip Tests

## Dependency Scope
[Dependencies transitively](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#Transitive_Dependencies)

[Scope](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#Dependency_Scope)

舉了兩個例子:

* `test`
* `provided`: 不compile，預期其它dependency有提供

## Multi Module Projects
* `productparent`

```bash
<groupId>com.james.product</groupId>
<artifactId>productparent</artifactId>
<packaging>pom</packaging> <!-- Not jar or war -->
<version>1.0</version>
<name>productparent</name>
```

* `productservices `

```bash
<parent>
    <groupId>com.james.product</groupId>
    <artifactId>productparent</artifactId>
    <version>1.0</version>
</parent>
<artifactId>productservices</artifactId>
<packaging>jar</packaging>
<name>productservices</name>
```

* `productweb `

```bash
<parent>
    <groupId>com.james.product</groupId>
    <artifactId>productparent</artifactId>
    <version>1.0</version>
</parent>
<artifactId>productweb</artifactId>
<packaging>war</packaging> <!-- Not jar -->
<name>productweb Maven Webapp</name>
...
<dependency>
  <groupId>com.james.product</groupId>
  <artifactId>productservices</artifactId>
  <version>1.0</version>
</dependency>
</dependencies>
```

### Plugins: 放在`build`
```bash
<build>
    <plugins>
      <plugin>
        <groupId>org.eclipse.jetty</groupId>
        <artifactId>jetty-maven-plugin</artifactId>
        <version>9.2.10.v20150310</version>
        <configuration>
          <scanIntervalSeconds>10</scanIntervalSeconds>
          <webApp>
            <contextPath>/</contextPath>
          </webApp>
        </configuration>
      </plugin>
    </plugins>
</build>
```

表示新增plugins或是override parent的設定，這邊我們新增jetty後就可以使用`mvn jetty:run`
