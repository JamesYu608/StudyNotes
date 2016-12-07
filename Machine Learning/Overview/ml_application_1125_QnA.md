# Q & A
台灣資料科學年會 - 人工智慧與機器學習在推薦系統上的應用

講者: 林守德(台大資工系教授)

## 問題: 在處理有x卻沒有y的問題，該怎麼解決?
一般來說怎麼解決是case by case，例如:

1. 使用unsupervised learning
2. 抽樣去標記y -> semi-supervise learning
3. 用類似的資料集的y，透過轉換函數轉成我們目標變數y (transfer learning)

## 問題: Data Mining, AI, Machine Learning, Deep learning的關係性？相同或不同處？
AI是目標，是比較大的集合

Data Driven(透過資料學東西)只是其中的一種實現方法 (Data Mining + Machine Learning)

也可能完全不需要data，例如專家系統

Deep Learning是Machine Learning的一種技巧

#### 其它講者的看法:
看法一(某講座):

* 機器學習：透過資料及其特徵來訓練模型 (train model)
* 深度學習：透過資料來建構模型及其適合的特徵 (train model & feature)

看法二(林軒田，從ML的觀點看其它topic):

* vs Data Mining
    * 若感興趣的property相同，DM=ML
    * 若感興趣的property相關，DM和ML可以互相幫助
    * 傳統的DM主要在增進large database的計算效率，但<mark>現在DM和ML已經漸漸難以區分</mark>
* vs Statistics
    * Statistics是實現ML的"其中一種"方法
* vs AI
    * ML是實現AI的"其中一種"方法

## 請問SVM現在還有研究的發展嗎？ 還是已經是過時的演算法了
已經很成熟，從研究的角度已經沒有這麼多東西可以做

但不代表實務上沒有用，也有許多相對應的lib

Deep Learning可能過兩年也是差不多 (TensorFlow...etc.)

## Natural Language Processing (NLP)在AI和ML是否具有一定的重要性？中文自然語言處理是否遇到許多瓶頸與問題？
釐清問題: NLP是AI中的一個重要問題(Machine Learning是非常重要的實作技術)

NPL的困難不僅限於中文，是對於諷刺、反串、倒裝等很難去辨識 (有時候連人都沒辦法第一時間了解)

Strong understanding短期內很難

## 比較好的方法，可能要跑很久，memory不夠大，計算的power不夠，有沒有適合的方法解決問題?
Resource Constrain Learning

## Feature越多越好嗎？還是由訓練者決定最重要的feature進去訓練模型即可
一般來說，不確定就丟，若不重要model最後會給低的weight

## 推薦系統中，通常會把"負"分的特性(不喜歡的item、評分低的item)用到系統中嗎?這樣的推薦效果會比較好嗎?
通常喜歡若是3，普通2，不喜歡我們不會用1，而是將它shift到負的

要解需要使用另一類的技巧

## 如果要做Online learning這個task，要拿多久或是多少的資料量來training才夠呢?另外要training一個model，一定要把所有的data拿來重新train嗎?還是可以用新進的資料based on舊model再train就好了。
Depend on task:

1. 會一直變(e.g. 股票)，就要一直跑
2. 只是因為資料不夠多所以要online learning，資料本身不太會變，跑到一定程度就可以停

## 東西比別人貴，推薦了user覺得不錯結果去別的地方買
1. 東西比較貴無解
2. 把價錢當成feature，可能就會被算進model的權重filter掉
