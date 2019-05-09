# 小程序,北京市内公交实时查询 By CleverBao

> 程序使用小程序云开发,需要创建云数据库.
> 小程序使用高德地图的web api,可以查询线路信息.

# 小程序配置

1. 注册高德地图api开发者,在控制台中创建应用,添加key,选择web端（js api）.

   [此处打开高德地图api控制台](https://lbs.amap.com/dev/key/app)

2. 将获取到的key填入文件 `miniprogram/libs/config-amap.js`中的`key: '高德api中的key值'`字段.

3. 注册成为微信小程序开发者.

> 此处省略...

4. 获取到小程序的appid将其填入文件`project.config.json`中的`"appid": "小程序appid",`字段

5. 在开发者工具的云开发中,选择数据库,创建集合`Doc_BjBusMsg`,`Doc_UserHistory`,`Doc_UserInfo`.

6. 选中集合`Doc_BjBusMsg`,导入json格式的北京公交线路数据.

   [此处下载北京公交线路数据](https://raw.githubusercontent.com/cleverbao/TempFiles/master/%E5%8C%97%E4%BA%AC%E5%85%AC%E4%BA%A4%E8%B7%AF%E7%BA%BF%E4%BF%A1%E6%81%AF/BjBus.json)

7. 发布小程序.

# Author CleverBao
