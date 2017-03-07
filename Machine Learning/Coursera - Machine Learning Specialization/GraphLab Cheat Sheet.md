# GraphLab Cheat Sheet
搜集這門課程中有使用到的graphlab API

# 設定
```python
# Product Key
graphlab.product_key.set_product_key('0F4C-13B5-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX')
# 印出key
graphlab.product_key.get_product_key()

# Worker Process數量
graphlab.set_runtime_config('GRAPHLAB_DEFAULT_NUM_PYLAMBDA_WORKERS', 4)
```

# SFrame
## 建立
* 從檔案

```python
graphlab.SFrame('./../home_data.gl/')
```

* 從dict

```python
# dict格式: 'column name': [row1 data, row2 data, ...]
dataset = {
    'id': [1, 2, 3],
    'name': ['James', 'Mark', 'Annie'],
    'age': [28, 40, 24]
}
sf = graphlab.SFrame(dataset)
```

## 統計
* 算row的數量

```python
len(sf)
# 等同
sf.num_rows()
```

* 排序

```python
sf.sort('col name', ascending=False)
```

## 新增column
```python
sf['Full Name'] = sf['First Name'] + ' ' + sf['Last Name']
```

## 選擇
* 原理

Step1: 

```python
# 直接運算SArray，會回傳SArray: [1, 0, 1, 0, ...]表示每個row是否滿足條件，例如:
sf['name'] == 'James' # return [0, 1, 0]，第二個row滿足

# 若使用SArray的apply function，一樣在function中return True或False (自動轉成1或0) 表示該row是否滿足條件
```

Step2: 

```python
# 使用sf[SArray]，SArray內容為1或0，表示選取該row
sf[graphlab.SArray([0, 1, 0])] # 選取第二個row
```

結合: 

```python
sf[sf['name'] == 'James']
```

### 法一
```python
# 基本
sf[sf['name'] == 'James']
# 多條件
sf[(sf['name'] == 'James') | (sf['age'] == '28')] # 要做and的話: &
```

### 法二 (apply function)
```python
sf[sf.apply(lambda x: True if (x['name'] == 'James' or x['age'] == 28) else False)]
```

### Rows
### Columns
* 使用`sf['col1', 'col2', ...]`

```python
sales['bedrooms'] # return SArray
sales['bedrooms', 'bathrooms'] # return SFrame
```

* 使用`sf[list]`，**一律回傳SFrame** (就算list中只有一個element也是)

```python
my_features = ['bedrooms']
sales[my_features] # return SFrame
my_features = ['bedrooms', 'bathrooms']
sales[my_features] # return SFrame
```

# Column (SArray)
## apply function
```python
def transform_country(country): # Loop column中的每一個row
    if country == 'USA':
        return 'United States'
    else:
        return country

sf['Country'].apply(transform_country) # return SArray
```

## 統計
```python
sf['age'].mean()
sf['age'].max()
sf['age'].sum()
```


# 資料視覺化
* 在IPython notebook中檢視SFrame圖表

```python
graphlab.canvas.set_target("ipynb")
```

## SFrame
* Overview

```python
sf.show()
```

* Scatter Plot

```python
sales.show(view="Scatter Plot", x="sqft_living", y="price")
```

* BoxWhisker Plot

```python
sales.show(view='BoxWhisker Plot', x='zipcode', y='price') # 左右可拉，中間可移動
```

## SArray
* 各類資料的總數、百分比

```python
sf['age'].show()
# 等同
sf['age'].show(view='Categorical')
```

## Additional: matplotlib.pyplot
```python
import matplotlib.pyplot as plt
%matplotlib inline
```

```python
plt.plot(
    test_data['sqft_living'], test_data['price'], '.', # X, Y, 用點表示
    test_data['sqft_living'], sqft_model.predict(test_data), '-') # X, Y, 用線表示
```

# 特定分析
* 計算單字數量

```python
graphlab.text_analytics.count_words(products['review']) # return dict
```

# Machine Learning
## 切割training / testing dataset
```python
# 80:20
train_data, test_data = sales.random_split(.8, seed=0) # 固定seed: 確保random結果一樣 (for homework)
```

## Regression
### Model
```python
sqft_model = graphlab.linear_regression.create(
    train_data, # training data set
    target="price", # Y
    features=['sqft_living']) # X，可傳array使用多個features
    
# validation_set=None # 停用隨機subset來驗證參數 (for homework)
```

* Coefficients

```python
sqft_model.get('coefficients')
```

### Predict
```python
sqft_model.predict(house1)
```

### Evaluate
```python
sqft_model.evaluate(test_data)
```

## Classifier
### Model
```python
sentiment_model = graphlab.logistic_classifier.create(
    train_data,
    target='sentiment',
    features=['word_count'], # dict
    validation_set=test_data)
```

* Coefficients

```python
sentiment_model['coefficients']
```

### Predict
```python
# output_type='probability': 不輸出1 / 0，而是信心水準
sentiment_model.predict(giraffe_reviews, output_type='probability')
```

### Evaluate
```python
# 1. Basic
sentiment_model.evaluate(test_data)

# 2. Roc Curve
sentiment_model.evaluate(test_data, metric='roc_curve') # Output: 文字
# 再做視覺化
sentiment_model.show(view='Evaluation')
```
