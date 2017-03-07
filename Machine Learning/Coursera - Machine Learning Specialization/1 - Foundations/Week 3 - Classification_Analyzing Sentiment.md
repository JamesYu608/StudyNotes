### [Machine Learning Foundations: A Case Study Approach](https://www.coursera.org/learn/ml-foundations/home/welcome)
Created by: University of Washington

# Week 3: Classification: Analyzing Sentiment
* [Course](#course)
* [Quiz](#quiz)
* [IPython Notebook](#ipynb)

# <a name="course"></a>Course
#### 情境
想透過ML model去分析一家日本料理店的"壽司"厲不厲害

如果從google的星星數來看不夠精準，因為這是店家整體的評價 (e.g. 4顆星 / 評論: 服務好、生魚片超讚，可惜壽司CP不高)

所以我們想將所有對於這間餐廳的評論文字，拆分成一個個句子，然後只挑出其中含有"壽司"這個關鍵字的那些句子放到model去分析

看看這家店在壽司這塊的整體評價如何

所以現在我們需要一個model，能對評論餐廳的句子 (input) 做預測，看這句評論到底是推薦 / 不推薦 (output，二元分類)

#### Solution: Simple Threshold Classifier
"假設"我們有一張對照表，裡面列出哪些是正面的單字 (e.g. great, amazing, ...)，哪些是負面的 (e.g. bad, sucks, ...)

然後去計算`要預測的句子中，正面、負面的單字各出現幾次`，若正面的比較多就是正面評價 (推薦)，否則就是負評

#### 問題
1. 如何列出、決定哪些單字為正面，哪些為負面 (靠人工很沒有效率且主觀)
2. 同一類的單字，強度也需要區分 (e.g. Great > Good)
3. 一個單字可能無法完整呈現意思 (e.g. Not Good)、反諷

**第1、2點我們可以透過ML去產生 (學習) 一張單字 / "權重"對照表** (怎麼做這邊先不討論)

第3點是一個比較複雜的課題，不在這個課程的討論範圍

## Linear Classifier
### Simple linear classifier
若我們現在已經有training data跑出的單字 / 權重對照表，例如:

| Word                | Weight   |
| ------------------- | -------- |
| good                | 1.0      |
| great               | 1.5      |
| bad                 | -1.0     |
| terrible            | -2.1     |
| the, we, .. (可忽略) | 0        |

就可以針對要預測的句子，`加總(各個單字出現的次數 * 權重)`，若大於零表示這句是正面評價 (推薦)，否則就是負評

這個classifier稱為**simple** linear classifier，因為Y是X的簡單求和

### Decision Boundaries
假設今天將單字對照表，簡單縮小到只有兩個單字: awesome和awful

<img src="./res/decision boundaries.jpeg" width=400>

等於0的那條線稱為decision boundary，因為它是**預測結果的分界**

上圖是兩個單字 (features) 的例子，空間是2D，decision boundary是**一條線**

三個單字的話空間是3D，decision boundary會是一個**平面**

單字數再往上加的話decision boundary會變成**超平面**

## Classification Error & Accuracy
* Error: 預測錯誤的筆數 / 總數 (最好的case為0，全錯)
* Arruracy: 預測正確的筆數 / 總數 (最好的case為1，全對)

$Error + Arruracy = 1$

### 怎麼樣的arruracy叫做準確?
首先，最起碼要比瞎猜的正確率還高 (e.g. 二元分類，低於50%的arruracy還不如瞎猜)

#### 90%的arruracy就表示classifier很準?
注意是否有**class imbalance**的情況，例如統計指出有90%的email信件都是垃圾信

那麼我們若全猜是垃圾信，arruracy也會有90%，所以這種case的90%不代表classifier非常有效

#### 最重要的，根據需求決定需要多少arruracy
1. 以上面餐廳評論的分析來說，可能有70、80%對使用者來說就已經很有效了。但醫療相關的應用就需要非常高的準確率
2. **猜錯的代價有多大?** 接下來討論

## Confusion Matrices
| True / Predicted |            +            |            -            |
|:----------------:|:-----------------------:|:-----------------------:|
|         +        | True Positive           | **False Negative (FN)** |
|         -        | **False Positive (FP)** | True Negative           |

* False Positive (FP): 沒有卻判斷成有
* False Negative (FN): 有卻判斷成沒有

### FP和FN視情境不同，會需要不同的取捨
* 醫療診斷的例子:

| True / Predicted |判斷有病 | 判斷沒病 |
|:----------------:|:--------:|:--------:|
|       有病       |   無誤   | **嚴重** |
|       沒病       |  白擔心  |   無誤   |

* 垃圾信的例子:

| True / Predicted | 判斷垃圾信 | 判斷一般信 |
|:----------------:|:----------:|:----------:|
|      垃圾信      |    無誤    |   有點煩   |
|      一般信      |  **嚴重**  |    無誤    |

## Learning Curves (需要多少data才能有效學習)
1. 一般來說，越多data越好，但是data的**質量**也很重要 (不然只會成為干擾的雜訊)
2. 理論上: 有些可以用公式算出
3. 實務上: 越複雜的model需要越多data，testing data可以計算model準確率

#### 就算有無限的data，model也不可能訓練到100%準確
到一定的訓練量之後，model的準確度就會提升的很緩慢，最後逐漸收斂 (e.g. 95%)，與100%的差距我們稱為**bias** (e.g. 5%)

#### 越複雜的model通常需要越多data
雖然**在data量少的時候，複雜的model通常表現得比簡單的model還要差**

但是在data足夠的情況下，**複雜的model最後的bias會比簡單的model還要小 (更準)**

## Class Probabilities
許多classifier能夠對預測的結果，提供所謂的**"confidence level"**

例如我們預測一個句子，classifier不只告訴我們這句是正面還是負面評價

還可以指出有75%的信心是正面，25%是負面

# <a name="quiz"></a>Quiz
* Simple threshold classifier (Simple linear classifier)
* 落在decision boundary上的點代表?
* 線性可分
* Accuracy / Random guessing
* Confusion Matrices
* Learning Curves

# <a name="ipynb"></a>IPython Notebook
訓練資料: 商品 / 評論 / Rating
目標: 自動分析評論是正評或負評

## Course
#### 1. 計算每則評論的各單字數量
#### 2. 視覺化rating的分佈後，決定幾分以上算正評
我們發現有給評論的分數普遍打很高，所以用4分以上的評論當作正評
#### 3. 跑logistic classifier (這邊先當作black box)，然後分析roc curve
Roc curve可以看出調整model時，confusion matrix的變化

拉動threshold，我們可以看出當threshold變的非常大或非常小的時候，預測的結果會變成全negative或全positive

**舉一個極端的例子:**

假設我很怕FP的情況，我就把threshold拉到最高(1)，所有case全部預測為negative，這樣我的FP就是0

但是accuracy就降到0.16，因為在這個dataset中真正為negative的非常少

## Assignment
#### 1. 課堂的model使用評論中的全部單字來訓練，這邊另外建立一個model是只會計算特定單字的
#### 2. 跑完後算出"love"有最高的正面權重，"terrible"則是最負面
#### 3. 計算accuracy，發現使用全部單字來訓練的model比只用特定單字的較高
是有些評價雖然非常正面 (5顆星)，但是評論中的單字並沒有出現在特定單字的列表中，或出現的不多

這種情況下只使用特定單字的model計算出的結果就沒這麼正面
