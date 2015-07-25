/*! PROJECT_NAME - v0.1.0 - 2015-07-25
* http://PROJECT_WEBSITE/
* Copyright (c) 2015 YOUR_NAME; Licensed MIT */
(function($){
    console.log = console.log || {};

    /*******************************************************************************
    *  Description: 标量时间类
    *  Changes:
    *******************************************************************************/
    var TimeScalarClass = Class.create({
        initialize: function(selector, range) {
            var timeObj = this.timeObj = $(selector);

            /* option = {unit="Minute"} 支持单位定制,最小单位 */
            this.range = range;

            /* 控件初始化 */
            timeObj.empty();
            var seleHTML = '<select id="Day"></select><label for="Day">天</label>';
            seleHTML += '<select id="Hour"></select><label for="Hour">时</label>';
            seleHTML += '<select id="Minute"></select><label for="Minute">分</label>';
            seleHTML += '<select id="Second"></select><label for="Second">秒</label>';
            timeObj.append(seleHTML);

            var dayObj = this.dayObj = $("#Day", timeObj);
            var hourObj = this.hourObj = $("#Hour", timeObj);
            var minuteObj = this.minuteObj = $("#Minute", timeObj);
            var secondObj = this.secondObj = $("#Second", timeObj);

            InitDayChangeEvent(range, timeObj, hourObj);
            InitHourChangeEvent(range, timeObj, dayObj, minuteObj);
            InitMinuteChangeEvent(range, timeObj, dayObj, hourObj, secondObj);

            /* 支持最小单位可定制 */
            HandleUnitEffect(range,timeObj);

            /* 初始化四位子控件 */
            InitTimeScalar(range, timeObj, dayObj, hourObj, minuteObj);
        },
        SetTimeControlValue: function(originVal){
            var dayObj = this.dayObj;
            var hourObj = this.hourObj;
            var minuteObj = this.minuteObj;
            var secondObj = this.secondObj;
            var timeObj = this.timeObj;

            /* 支持最小单位可定制 */
            var amplifier = timeObj.data("amplifier");
            var second = originVal * amplifier;

            var dhmsJson = Second2DHMS(second);

            dayObj.val(dhmsJson.day);
            dayObj.change();

            hourObj.val(dhmsJson.hour);
            hourObj.change();

            minuteObj.val(dhmsJson.minute);
            minuteObj.change();

            secondObj.val(dhmsJson.second);
        },
        GetTimeControlValue: function(){
            var dayObj = this.dayObj;
            var hourObj = this.hourObj;
            var minuteObj = this.minuteObj;
            var secondObj = this.secondObj;
            var timeObj = this.timeObj;

            var d = dayObj.val();  
            var h = hourObj.val();
            var m = minuteObj.val();
            var s = secondObj.val();

            var totolSec = d * 86400
                + h * 3600
                + m * 60
                + s * 1;

            /* 支持最小单位可定制 */
            var amplifier = timeObj.data("amplifier");
            var transVal = Math.floor(totolSec / amplifier);

            return transVal;
        }
    });

    /* 将类开放出去，应用可以使用 */
    window.TimeScalarClass = TimeScalarClass;


    /*******************************************************************************
    *  Description: 以下为时间类的私有函数
    *  Changes:
    *******************************************************************************/
    /* 将秒为单位累计量,转化为 天时分秒 */
    function Second2DHMS(num) {
        var s = num % 60;
        num=parseInt(num/60);
        var m = num % 60;
        num = parseInt(num/60);
        var h = num % 24;
        num = parseInt(num/24);
        var d = num;
        //console.log(d+'天'+h+'时'+m+'分'+s+'秒')

        return {
            day: d,
            hour: h,
            minute: m,
            second: s
        };
    }

    /* 单位可配置,配置单位后需要对流程做适配 */
    function HandleUnitEffect(range, timeObj)
    {
        range.unit = range.unit || "Second";

        var rangeMap = {
            "Day":{amplifier:86400, lowCtl:["Hour", "Minute", "Second"]},
            "Hour":{amplifier:3600, lowCtl:["Minute", "Second"]},
            "Minute":{amplifier:60, lowCtl:["Second"]},
            "Second":{amplifier:1, lowCtl:[]}
        };

        var map = rangeMap[range.unit];
        var amplifier = map.amplifier;
        var lowCtl = map.lowCtl;

        /* 在模板上记录放大倍数,以备设置和显示使用 */
        timeObj.data("amplifier", amplifier);

        /* 范围上下限转换为秒,后走通用流程即时 Second 2 DHMS */
        range.min = range.min * amplifier;
        range.max = range.max * amplifier;

        /* 设置单位后,需要隐藏掉更低级控件 */
        for ( var i=0; i<lowCtl.length; i++ )
        {
            var id = lowCtl[i];
            $("[id='"+id+"']", timeObj).hide();
            $("label[for='"+id+"']", timeObj).hide();
        }
    }

    function FillSelectOption(controlObj, min, max)
    {
        controlObj.empty();
        //缓存提速
        var domCache = [];
        for (var i = min; i <= max; i++)
        {
            domCache.push("<option title='" +i+ "' value='" +i+ "'>"+i+"</option>");
        }
        controlObj.append(domCache.join());
    }

    function InitDayChangeEvent(range, timeObj, hourObj){
        timeObj.off( "change", "#Day" );

        /* 天控件 值选中后,改变时控件可选值 */
        timeObj.on("change", "#Day", function(event){
            var day = $(this).val();
            day = parseInt(day, 10);

            var maxDay = Math.floor(range.max / 86400);
            var maxDayRemain = range.max % 86400;
            var maxHour = Math.floor(maxDayRemain / 3600);
            var minDay = Math.floor(range.min / 86400);
            var minDayRemain = range.min % 86400;
            var minHour = Math.floor(minDayRemain / 3600);
            /* 天值 最大和最小 都是一个值
                例如 {min:4294967294, max:4294967295}
                49710天6时28分15秒
                49710天6时28分14秒
             */
            if ( minDay === maxDay )
            {
                FillSelectOption(hourObj, minHour, maxHour);
                $(this).data("cursor", "MinMax");
            }
            /* 天值 在 最大 和 最小 之间 */
            else if ( day > minDay && day < maxDay )
            {
                FillSelectOption(hourObj, 0, 23);
                $(this).data("cursor", "Middle");
            }
            /* 天值 为最大 */
            else if ( day === maxDay )
            {
                FillSelectOption(hourObj, 0, maxHour);
                $(this).data("cursor", "Max");
            }
            /* 天值 为最小 */
            else if ( day === minDay )
            {
                FillSelectOption(hourObj, minHour, 23);
                $(this).data("cursor", "Min");
            }
            else
            {
            }

            /* 更新分控件可选值,
                一旦选择了最大值,这些控件范围有可能是部分可选项,
                如果天选择不为最大值,则这些控件需要包括全部可选项。*/
            hourObj.change();

            event.stopPropagation();
        });
    }

    function InitHourChangeEvent(range, timeObj, dayObj, minuteObj){
        timeObj.off( "change", "#Hour" );

        /* 时控件 值选中后,改变分控件可选值 */
        timeObj.on("change", "#Hour", function(event){
            var hour = $(this).val();
            hour = parseInt(hour, 10);

            var maxDayRemain = range.max % 86400;
            var maxHour = Math.floor(maxDayRemain / 3600);
            var maxHourRemain = range.max % 3600;
            var maxMinute = Math.floor(maxHourRemain / 60);
            var minDayRemain = range.min % 86400;
            var minHour = Math.floor(minDayRemain / 3600);
            var minHourRemain = range.min % 3600;
            var minMinute = Math.floor(minHourRemain / 60);

            /* 时值 最大和最小 都是一个值
                例如 {min:4294967294, max:4294967295}
                49710天6时28分15秒
                49710天6时28分14秒
             */
            if ( (dayObj.data("cursor") === "MinMax") 
                && (minHour === maxHour) )
            {
                FillSelectOption(minuteObj, minMinute, maxMinute);
                $(this).data("cursor", "MinMax");
            }
            else if ( (dayObj.data("cursor") === "Max"
                || dayObj.data("cursor") === "MinMax" )
                && hour === maxHour )
            {
                FillSelectOption(minuteObj, 0, maxMinute);
                $(this).data("cursor", "Max");
            }
            else if ( (dayObj.data("cursor") === "Min"
                || dayObj.data("cursor") === "MinMax" )
                && hour === minHour )
            {
                FillSelectOption(minuteObj, minMinute, 59);
                $(this).data("cursor", "Min");
            }
            else
            {
                FillSelectOption(minuteObj, 0, 59);
                $(this).data("cursor", "Middle");
            }
            /* 更新秒控件可选值,
                一旦选择了最大值,这些控件范围有可能是部分可选项,
                如果天选择不为最大值,则这些控件需要包括全部可选项。*/
            minuteObj.change();

            event.stopPropagation();
        });
    }

    function InitMinuteChangeEvent(range, timeObj, dayObj, hourObj, secondObj){
        timeObj.off( "change", "#Minute" );

        /* 分控件 值选中后,改变秒控件可选值 */
        timeObj.on("change", "#Minute", function(event){
            var minute = $(this).val();
            minute = parseInt(minute, 10);

            var maxHourRemain = range.max % 3600;
            var maxMinute = Math.floor(maxHourRemain / 60);
            var maxMinuteRemain = range.max % 60;
            var maxSecond = Math.floor(maxMinuteRemain / 1);
            var minHourRemain = range.min % 3600;
            var minMinute = Math.floor(minHourRemain / 60);
            var minMinuteRemain = range.min % 60;
            var minSecond = Math.floor(minMinuteRemain / 1);

            /* 分值 最大和最小 都是一个值
                例如 {min:4294967294, max:4294967295}
                49710天6时28分15秒
                49710天6时28分14秒
             */
            if ( dayObj.data("cursor") === "MinMax"
                && hourObj.data("cursor") === "MinMax" 
                && minMinute === maxMinute )
            {
                FillSelectOption(secondObj, minSecond, maxSecond);
            }
            else if ( (dayObj.data("cursor") === "Max"
                    || dayObj.data("cursor") === "MinMax" )
                && ( hourObj.data("cursor") === "Max"
                    || hourObj.data("cursor") === "MinMax" )
                && minute === maxMinute )
            {
                FillSelectOption(secondObj, 0, maxSecond);
            }
            else if ( (dayObj.data("cursor") === "Min"
                    || dayObj.data("cursor") === "MinMax" )
                && ( hourObj.data("cursor") === "Min"
                    || hourObj.data("cursor") === "MinMax" )
                && minute === minMinute )
            {
                FillSelectOption(secondObj, minSecond, 59);
            }
            else
            {
                FillSelectOption(secondObj, 0, 59);
            }

            event.stopPropagation();
        });
    }

    function InitTimeScalar(range, timeObj, dayObj, hourObj, minuteObj){
        // console.log('--------------- init time ['+range.min+''+range.max+'] -------');
        // Second2DHMS(range.min)
        // Second2DHMS(range.max)
        var minDay = Math.floor(range.min / 86400);
        var maxDay = Math.floor(range.max / 86400);

        /* 填充天控件可选项 */
        FillSelectOption(dayObj, minDay, maxDay);

        /* 触发天控件change,初始化填充时分秒控件可选项 */
        dayObj.change();

        /* 如果最大单位未达到,则隐藏掉对应控件 */
        if ( maxDay === 0 )
        {
            dayObj.hide();
            $("label[for='Day']", timeObj).hide();

            var maxHour = Math.floor(range.max / 3600);
            if ( maxHour === 0 )
            {
                hourObj.hide();
                $("label[for='Hour']", timeObj).hide();

                var maxMinute = Math.floor(range.max / 60);
                if ( maxMinute === 0 )
                {
                    minuteObj.hide();
                    $("label[for='Minute']", timeObj).hide();
                }
            }
        }
    }
})(jQuery);

