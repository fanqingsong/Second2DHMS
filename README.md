# Second2DHMS
将xxx秒转换为X天X时X分X秒， 更加有利于用户习惯， 提供显示和配置功能(项目的范围：javascript 动态生成 时间的HTML控件)

依赖：
Jquery库
class库 https://github.com/protonet/jquery-class-create/

---------------- 背景 ---------------------

时间累计值，在顶层一般以秒为计算单位， 所以到页面上如果直接显示xx秒， 如果秒的值很大， 则用户得不到直观的感受， 到底有多长时间，

在日长生活中， 人们以天 时 分 秒为单位来记录时间累计值， 这样更容易为人们接受， 提高易用性。

本文就为了解决这个问题， 在页面控件 和 累计值秒 之间建立转换， 提供显示和配置。

---------------- 设计思路 -------------------

将秒转换为 天 时 分 秒 控件， 此处控件为下拉框，  从右到左， 分为四级， 每一级的单位权值递减，

天 的可选值 为  0 - +无穷， 1天=86400秒

时 的可选值 为 0 - 23， 1时=3600秒

分 的可选值为 0-59， 1分=60秒

秒 的可选值为 0-59

 

时间控件支持的范围 range=[x, y],  y>=x>=0

但是，需要注意当上一级单位下拉框选择为边界值时候， 则下一级下拉框中， 可选项可能不能填满， 例如

range = [0, 60],  分可选值为 0-1， 当分选择为 0时候， 秒可选值为 0-59， 当分选择为1时候， 秒可选值为0

 

同时对于最大值达不到的 单位控件， 则需要隐藏。

 

时间控件 静态包括 天 时 分 秒 四个子控件（四个下拉框），

控件加载时候， 根据range初始化时间控件， 此时该最大值达不到的单位控件需要隐藏掉， 各个子控件填充可选内容，  此过程记录为  InitTime

下一级控件需要根据上一级控件的当前值， 来填充可选值， 此功能实现需要在上一级的控件的 change事件中实现， 并且按照级别递归触发change。

------------------- 开发过程 ----------------------

写完初始化函数， 和天 时 分 的change事件，

书写TDD相关的测试代码， 将各个用例写入测试代码， 则拉起一个测试网， 调试过程中， 此网可以一步一步添加，

在添加过程中， 遇到问题， 可会修改时间控件代码，  修改完毕后， 则添加下一个用例，

直到添加调试完所有你认可的测试用例。

 

这样开发后的控件， 经过足够多的用例检验， 质量可以保证。

而且为以后的维护打下基础， 如果后期需要微调此控件， 则微调后， 通过微调自己的TDD代码， 并且也需要通过本次开发的测试用例代码， 保证质量的继承性。


reference link : http://www.cnblogs.com/lightsong/p/4641893.html
