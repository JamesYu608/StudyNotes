# 重點筆記: 你所不知道的機器學習
台灣資料科學年會 - 人工智慧與機器學習在推薦系統上的應用

講者: 林守德(台大資工系教授)

### Agenda

* [A variety of ML Scenarios](#ml-scenarios)
* [如何訓練出好的機器學習模型](#train-model)

# <a name="ml-scenarios"></a>A variety of ML Scenarios
太基本或細節略過，只截錄部分重點

* Supervised Learning
    * [Classification](#classification)
        * [Multi-label Learning](#multi-label)
        * [Cost-sensitive Learning](#cost-sensitive)
        * [Multi-instance Learning](#multi-instance)
    * Regression
* Semi-supervised Learning
    * [Active Learning](#active)
* Unsupervised Learning
    * [Clustering](#clustering)
    * Learning Data Distribution (e.g. PGM)
* 比較大的topic，可以用在以上三種learning，這裡先略過
    * Deep Learning
    * [Probabilistic Graphical Models (PGM)](https://www.quora.com/How-do-probabilistic-graphical-models-PGM-relate-to-machine-learning#)
* [Reinforcement Learning](#reinforcement)
* Variations
    * Online Learning (vs Batch Learning)
    * [Transfer Learning](#transfer)
    * [Distributed Learning](#distributed)

## Supervised Learning
### <a name="classification"></a>Classification
Output可以是:

1. Ordinal: small, medium, large
2. Non-ordinal: blue, green, orange

依Output分成幾類:

1. Binary Classification (yes/no, success/failure...etc.)
2. Multi-class Classification

Classifier:

1. Linear
2. Non-linear

#### 主流的models

* k-nearest neighbor (kNN)
* Decision Tree (DT)
* Support Vector Machine (SVM)
* Neural Network (NN)
* ...

### <a name="multi-label"></a>Multi-label Learning
和典型classification的差別在於，一個input有多個labels而非一個

<img src="./res/Multi-label Learning.png" width="400">
*from 人工智慧與機器學習在推薦系統上的應用, 林守德*

例如，一張照片可以加多個tags，我們想要從大量的照片以及對應的tags，訓練機器辨認一張沒看過的照片，可能屬於哪些tags

#### 主流的models

* Binary Relevance
* Label Powerset
* ML-KNN
* IBLR
* ...

### <a name="cost-sensitive"></a>Cost-sensitive Learning
和典型classification的差別在於，不同的分類會有不一樣的權重

例如，若要訓練機器判斷一個人有沒有癌症，那麼我們會放大明明有癌症，卻被判斷為正常的成本 (寧可把沒事的病人當成有事，也不要把有事的病人判斷成沒事)

其它適合的例子還有偵測盜刷 (寧可先懷疑有被盜刷再去向user澄清)、保險箱指紋辨識 (寧可先reject不太確定的指紋也不能亂放人)

#### 主流的models
* Cost-sensitive SVM
* Cost-sensitive sampling

### <a name="multi-instance"></a>Multi-instance Learning
和典型classification的差別在於，訓練的input是將多個x，也就是instances，變成一個bag，然後給這個bag一個label，使用多個bags來訓練model

我們希望在訓練後，機器能夠辨認一個沒看過的instance或是bag，來判斷屬於哪個label

例如，將乳房的x光照片，切成多個小區塊(instances)提取特徵後變成一個bag，只要其中一個instance有乳癌跡象我們就將label設為1(有乳癌)，若整個bag都是健康的instacne我們就將label設為0(沒有乳癌)

在經過大量的x光照片(bags)訓練後，我們希望機器能夠辨認沒看過的照片(bag)，有沒有乳癌 (label=1)

## Semi-supervised Learning
要標記所有data通常<mark>成本很高</mark>或是根本無法達成，實務上常用semi-supervised learning的方式，標記**部分**data來讓機器學習

### <a name="active"></a>Active Learning
由機器**主動**來詢問我們data的標記是什麼

例如，一開始我們手動寫了一些字，並給這些字標記後丟給機器去學，學完後我們丟大量沒有標記的字給機器，當機器遇到沒有辦法判斷或不確定的字的時候，主動詢問我們這些字是什麼，我們再給這些字標記讓機器學，重複這個過程

Active learning的目標是希望機器能透過少數的主動提問(關鍵問題)，達成學習的效果(減少人類手動標記的成本)

## Unsupervised Learning
一個有趣的觀點，小嬰兒是如何學習他們的第一語言(unsupervised)，長大後又是如何學習第二語言(supervised)?

### <a name="clustering"></a>Clustering
#### 主流的models
* K-Means
* EM
* Hierarchical classification
* ...

## <a name="reinforcement"></a>Reinforcement Learning
是一個決策產生的"過程"，一套連續的states和actions以及最終的reward是一次學習，我們的目標是透過多次的學習找出最佳化的決策

(可以想成是有特定reward的Markov Decision Process)

例如，讓電腦學玩超級瑪莉，電腦會不斷記錄角色的states，採取不同actions。如果角色死掉了，死前的一連串過程都會被視為"不好的"，反之，如果過關，那麼這些過程就是一個"好的"決策

*__Additional:__ AlphaGo的學習策略為supervised learning + reinforcement learning*

* 第一階段: Supervised Learning, 天下棋手為我師
    * Data: 過去棋譜
    * Learning: X:盤面 / Y: Next Move (已有標準答案)
    * Results: 電腦可以下棋，但還不是高手
* 第二階段: Reinforcement Learning, 超越過去的自己
    * Data: 由第一階段的自己產生
    * Learning: 不斷記錄盤面和actions (next move)，若最後贏了就是好的決策
    * Results: You know it!

## Variations
### <a name="transfer"></a>Transfer Learning
**實務上常見，資料量不足(或根本還沒有資料)，要怎麼訓練model?**

例如想做一個商品推薦系統，但是一開始沒有資料 -> 沒辦法訓練model -> 沒辦法推薦顧客消費 -> 還是沒有資料 -> loop...

雞生蛋，蛋生雞，雞蛋都生不出來怎麼辦?

**我們可以把相似的資料作為初始資料(可能會先做一些mapping的處理)，拿來訓練model**

例如想訓練電腦辨識飛機的照片，假設我們一開始只有鳥的照片

我們可以先拿鳥的照片來訓練，之後有飛機的照片的時候再給這些照片更高的權重

也就是說，雖然transfer learning可以縮小新模型所需要的訓練資料量，但<mark>仍需要真正的資料</mark> (否則這個model往後會一律把鳥辨認成飛機)

### <a name="distributed"></a>Distributed Learning

<img src="./res/Distributed Learning.png" width="600">

*from 人工智慧與機器學習在推薦系統上的應用, 林守德*

# <a name="train-model"></a>如何訓練出好的機器學習模型

* [Feature Engineering](#feature-engineering)* [Blending and Ensemble](#blending-ensemble)
* [Training and Optimization](#training-optimization)
* [Validation](#validation)* [Novel ideas](#novel)

## <a name="feature-engineering"></a>Feature Engineering
影響model performance最重要的關鍵之一，feature大致上可以分成:

* Categorical

  擴展成binary features，例如有3000個學生，若用學號來代表學生沒有意義，無法訓練model
  
  我們可以將代表學生的變數用一個feature vector來表示，則此vector總用有3000維，值皆為0/1 (指出是哪個學生)
  
* Numerical

  可能需要經過scaling / normalization，否則數值較小的變數對model的影響，會被另一個數值較大的變數蓋過去
  
  e.g. : $N(0, 1)$, $log(1+x)$, linear scaling...etc.
  
  在決定要怎麼做scaling前，可以先將資料視覺化，觀察原始資料的分布情況
  
### Feature Combination

要解決的問題:

* Non-linear classifier (e.g. Kernel SVM)
    * 優 - 可以抓到feature之間可能的交互關係
    * 缺 - 慢，若training size非常大可能根本跑不出來
    
* Linear classifier
    * 優 - 快
    * 缺 - 沒辦法考慮到feature之間可能的交互關係

<mark>利用feature combination可以讓linear classifier去抓到某些feature間可能的交互關係 (結合上述兩者優點)</mark>

參考[這個例子](http://stackoverflow.com/questions/9148276/do-combination-of-existing-features-make-new-features)，我們本來的資料有:

* 兩個feature: $x_1,x_2$
* 跑完的classifier: $f(x)=x_1+2x_2$

考慮這兩筆資料: $(6, 1)$、$(3, 2.5)$，跑出來結果都是8，但它們其實是不同label，想要分開它們

加入一個combined feature(多一個維度)，令 $x_3=x_1*x_2$，若跑完的classifier為 $f(x)=x_1+2x_2+0.5x_3$，現在

* $f(6, 1)=1*6+2*1+0.5*(6*1)=11$
* $f(3, 2.5)=1*3+2*2.5+0.5*(3*2.5)=11.75$

我們加入feature combination後再跑linear model，這兩筆資料就被classifier分開了

類似例子像是feature為身高、體重，試著加入身高＋體重的feature看能不能利用它們的交互關係

或是**有階層關係的feature也可以拿來combine看看** (e.g. 部門、單位 -> 部門+單位)

*__Note:__ Combine哪些features有用、要怎麼combine? -> 需要domain knowledge (也有暴力解的方法)*

#### Features from Near-by Instances
一些"相近"的instances的features也可以combined，何謂相近:

* kNN in terms of features* Instances close in time
* Instances close in space
* ...

*__JY:__ 這邊我不太確定意思，是否像是，假設資料為一年份，我們可以依時間切成四季(instances close in time)，然後分別算個季平均之類的當成新feature?*

## <a name="blending-ensemble"></a>Blending and Ensemble
核心思想: 三個臭皮匠，勝過一個諸葛亮

<mark>同一個問題，結合多個models可能產出更好的結果</mark> (考試作弊，每個人把自己有把握的答案合在一起)，分成兩步:

1. Blending - 將少數幾個models的結果合併
    * 常用技巧: Non-linear methods (e.g. Kernel-SVM, Neural Network)
2. Ensemble - 將step1以及其它的models的結果合併 (小心overfitting)
    * 常用技巧: Simple linear, Voting methods (多數決)

**關鍵: 引進越多具有"差異"的models效果越好**，差異可以從:

1. Models    * 不同的objective function    * 相同的objective function，不同的最佳化方法    * 增加或減少一些限制 (e.g. MF vs. NMF)2. Models的parameters和initialization
    * 通常效果有限，但是可以避免overfitting3. Sampling的方法 (data和validation set)

*__Note:__ 實務上可以發現，並不是挑出幾個表現最好的models就可以達到最好的效果，常常單獨表現較差的models能提供許多額外的資訊 (第一名跟第二名做的事很像 -> 貢獻低)*

## <a name="training-optimization"></a>Training and Optimization
避免overfitting非常重要:

* 可以加入[regularization terms](http://cpmarkchang.logdown.com/posts/193261-machine-learning-overfitting-and-regularization)
* Occam’s Razor
    * Linear > non-linear
    * 大多數instances擁有的少數幾個features > 只有少部分instances才有的多個features

## <a name="validation"></a>Validation
Training / Testing: 減少overfitting的機會，training error接近validation error才不容易發生overfitting

Validation和未來要預測的資料之分佈要相同

### Random Sampling不一定是最好的方法 (for some cases)
#### Case 1 - 從胸腔X光片預測是否有癌症 (multi-instance classification problem)
若隨機抽樣instances(每個instance都是照片的一小部分)拿來train / test，會跟實際結果落差很大

這些instances的結果是受同一張照片，其它instances的影響，等於偷看到答案

應該以照片(patient-based)做為抽樣方法來驗證

#### Case 2 - 比賽的時候發現隨機抽樣訓練出來的model，跟實際結果落差很大
Sample多個不同的validation set，然後選擇最接近實際結果的那個set

## <a name="novel"></a>Novel ideas
* 加入隨機性到model (e.g. random restart)，然後平均這些results可以避免overfitting
* Learning Rate: 當improvement變小的時候(e.g. 0.1%~0.6%)，降低learning rate通常會有幫助
