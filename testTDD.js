/*******************************************************************************
Description: 测试用例
Changes:
*******************************************************************************/

$(function(){
    // every person should be able to sleep, not just pirates!
    TimeScalarClass.addMethods({
        TestSetGet: function (second, bResult)
        {
            //console.log("----- test set time value("+second+") --------" );

            this.SetTimeControlValue(second);
            var realSec = this.GetTimeControlValue();
            var bRealResult = ( realSec == second );

            if ( bResult != bRealResult )
            {
                console.warn("!!!! second("+second+") test failed! realSec="+realSec);
            }
            else
            {
                console.log("second("+second+") test success!");
            }
        }
    });

    /* 一般范围测试：
    1、页面载入，没有后台赋值， 查看各个控件可选范围：
        天 0-49710
        时 0-23
        分 0-59
        秒 0-59
    2、MAX测试：
        a. 选择天为 49710， 查看时选择范围为 0-6
        b. 选择时为 6， 查看分选择范围为 0-28
        c. 选择分为 28， 查看秒选择范围为 0-15, 选择秒15 OK
        d. 再次切换分为 27， 查看秒 可选范围 为 0-59
        e. 再次切换时为 5， 查看分 可选值为 0-59
        f. 再次切换天为 49709，查看时 可选值为 0-23
        49710天6时28分15秒
    */
    var range = {min:0, max:4294967295, unit:"Second"}
    var timeObj = new TimeScalarClass("#TimeScalar", range);

    timeObj.TestSetGet(4294967295, true);
    timeObj.TestSetGet(4294967296, false);
    timeObj.TestSetGet(100, true);
    timeObj.TestSetGet(0, true);
    timeObj.TestSetGet(-1, false);


    /* range相差1s测试
            范围为 {min:4294967294, max:4294967295}
            49710天6时28分15秒
            49710天6时28分14秒
        查看各个控件可选值
            天 - 49710
            时 - 6
            分 - 28
            秒 - 14-15
    */
    var range = {min:4294967294, max:4294967295, unit:"Second"}
    var timeObj = new TimeScalarClass("#TimeScalar", range);

    timeObj.TestSetGet(4294967295, true);
    timeObj.TestSetGet(4294967296, false);
    timeObj.TestSetGet(4294967294, true);
    timeObj.TestSetGet(4294967293, false);

    /* range相差1分钟测试
        范围 {min:4294967235, max:4294967295}
        49710天6时28分15秒
        49710天6时27分15秒
        查看各个控件可选值
            天 - 49710
            时 - 6
            分 - 27-28
            秒 - 15-59 选择分为 27
            秒 - 0-15 选择分为 28
     */
    var range = {min:4294967235, max:4294967295, unit:"Second"}
    var timeObj = new TimeScalarClass("#TimeScalar", range);

    timeObj.TestSetGet(4294967295, true);
    timeObj.TestSetGet(4294967296, false);
    timeObj.TestSetGet(4294967235, true);
    timeObj.TestSetGet(4294967234, false);

    /* range相差1小时测试
        范围 {min:4294963695, max:4294967295}
        49710天6时28分15秒
        49710天5时28分15秒
        查看各个控件可选值
            天 - 49710
            时 - 5-6
            分 - 28-59 选择时为 5
            分 - 0-28 选择时为 6
            秒 - 15-59 选择分为 28，时为5
            秒 - 0-59 选择分为 29，时为5
            秒 - 0-15 选择分为 28， 时为6
            秒 - 0-59 选择分为 27， 时为6
     */
    var range = {min:4294963695, max:4294967295, unit:"Second"}
    var timeObj = new TimeScalarClass("#TimeScalar", range);

    timeObj.TestSetGet(4294967295, true);
    timeObj.TestSetGet(4294967296, false);
    timeObj.TestSetGet(4294963695, true);
    timeObj.TestSetGet(4294963694, false);


    /* range相差1天测试
        范围 {min:4294880895, max:4294967295}
        49710天6时28分15秒
        49709天6时28分15秒
        查看各个控件可选值
            天 - 49709-49710
            时 - 6-23 选择天为49709
            时 - 0-6 选择天为49710
            选择天为49709，时为7， 查看分秒范围都为 0-59
            选择天为49710，时为5， 查看分秒范围都为 0-59
     */
    var range = {min:4294880895, max:4294967295, unit:"Second"}
    var timeObj = new TimeScalarClass("#TimeScalar", range);

    timeObj.TestSetGet(4294967295, true);
    timeObj.TestSetGet(4294967296, false);
    timeObj.TestSetGet(4294880895, true);
    timeObj.TestSetGet(4294880894, false);

    /* range最大值为1天测试，查看最大和最小值如下可选
        1天0时0分0秒
        0天0时0分0秒
     */
    var range = {min:0, max:86400, unit:"Second"}
    var timeObj = new TimeScalarClass("#TimeScalar", range);

    timeObj.TestSetGet(86400, true);
    timeObj.TestSetGet(86401, false);
    timeObj.TestSetGet(0, true);
    timeObj.TestSetGet(-1, false);

    /* range最大值不足1天测试
        天控件未显示，时分秒最大最小值可选如下
        0天23时59分59秒
        0天0时0分0秒
     */
    var range = {min:0, max:86399, unit:"Second"}
    var timeObj = new TimeScalarClass("#TimeScalar", range);

    timeObj.TestSetGet(86399, true);
    timeObj.TestSetGet(86400, false);
    timeObj.TestSetGet(0, true);
    timeObj.TestSetGet(-1, false);

    /* range最大值为1小时
        时分秒最大最小值可选如下
        0天1时0分0秒
        0天0时0分0秒
     */
    var range = {min:0, max:3600, unit:"Second"}
    var timeObj = new TimeScalarClass("#TimeScalar", range);

    timeObj.TestSetGet(3600, true);
    timeObj.TestSetGet(3601, false);
    timeObj.TestSetGet(0, true);
    timeObj.TestSetGet(-1, false);

    /* range最大值为 3599
        时分秒最大最小值可选如下
        0天0时59分59秒
        0天0时0分0秒
     */
    var range = {min:0, max:3599, unit:"Second"}
    var timeObj = new TimeScalarClass("#TimeScalar", range);

    timeObj.TestSetGet(3599, true);
    timeObj.TestSetGet(3600, false);
    timeObj.TestSetGet(0, true);
    timeObj.TestSetGet(-1, false);

    /* range最大值 1分钟 
        0天0时1分0秒
        0天0时0分0秒
    */
    var range = {min:0, max:60, unit:"Second"}
    var timeObj = new TimeScalarClass("#TimeScalar", range);

    timeObj.TestSetGet(60, true);
    timeObj.TestSetGet(61, false);
    timeObj.TestSetGet(0, true);
    timeObj.TestSetGet(-1, false);

    /* range最大值 59
        0天0时0分59秒
        0天0时0分0秒
    */
    var range = {min:0, max:59, unit:"Second"}
    var timeObj = new TimeScalarClass("#TimeScalar", range);

    timeObj.TestSetGet(59, true);
    timeObj.TestSetGet(60, false);
    timeObj.TestSetGet(0, true);
    timeObj.TestSetGet(-1, false);
    timeObj.TestSetGet(59, true);


})

