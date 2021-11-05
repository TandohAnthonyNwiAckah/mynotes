<template>
    <div class="calendar-container">
        <div v-if="showHeader" class="q-pa-sm" :class="headerClass">
            <div class="row row q-col-gutter-md justify-between">
                <div  class="text-h6 col-md-auto" v-if="headerTitle">{{ headerTitle }}</div>
                <div v-if="dateControls" class="col-md-auto">
                    <q-btn flat dense :icon="todayIcon"  class="q-mx-md" @click="setToday"></q-btn>
                    <q-btn flat dense round :icon="prevDayIcon" @click="onPrev"></q-btn>
                    <q-btn flat  dense round :icon="nextDayIcon" @click="onNext"></q-btn>
                </div>
                <div class="col-md-auto text-h6">
                    {{currentDateTitle}}
                </div>
                <div class="col-md-2">
                    <q-select v-if="viewChange"  v-model="calendarView" :options="viewOptions" outlined  dense options-dense emit-value  map-options ></q-select>
                </div>
            </div>
        </div>
        <div v-if="description" class="q-pa-md">{{ description }}</div>
        <q-separator class="q-my-md" />
        <q-calendar :style="{ height }" :keyValue="0" ref="calendar" :view="calendarView"  :animated="false"
            class="calendar" v-model="selectedDate"  v-bind="$attrs" @click:date2="addEvent"  @click:time2="addEvent" @click:day2="addEvent"  @click:week2="addEvent">

            <template #day-header="{ timestamp }">
                <span v-for="(event, index) in getAllEventsByDate[timestamp.date]" :key="index" @click.stop.prevent="showEvent(event)">
                    <slot name="headerday" :event="event" :timestamp="timestamp" />
                </span>
            </template>

            <template #day-body="{ timestamp, timeStartPos, timeDurationHeight }">
                <template v-if="calendarView.indexOf('agenda') < 0">
                    <template v-for="(event, index) in getDateEvents(timestamp.date)" >
                        <div :key="index" class="event" @click.stop.prevent="showEvent(event)" :style="badgeStyles(event, timeStartPos, timeDurationHeight) ">
                            <slot name="weekday" :event="event" :timestamp="timestamp" />
                        </div>
                    </template>
                </template>
                <template v-else>
                    <template v-for="(event, index) in getDateAgenda(timestamp.date)">
                        <div @click.stop.prevent="showEvent(event)" :key="index" :style="badgeStyles(event)">
                             <slot name="agenda" :event="event" :timestamp="timestamp" />
                        </div>
                    </template>
                </template>
            </template>

            <template #day="{ timestamp }">
                <div v-for="(event, index) in getDateEvents(timestamp.date)" :key="index" @click.stop.prevent="showEvent(event)" :style="badgeStyles(event)">
                    <slot name="monthday" :event="event" :timestamp="timestamp" />
                </div>
            </template>
        </q-calendar>
    </div>
</template>
<script>
    import QCalendar from "@quasar/quasar-ui-qcalendar";
    import { PageMixin } from "../mixins/page.js";
    import { date } from "quasar";
    export default {
        props: {
            pageName: {
                type: String,
                default: "",
            },
            eventColor: {
                type: String,
                default: "teal",
            },
            todayIcon: {
                type: String,
                default: "icon",
            },
            prevDayIcon: {
                type: String,
                default: "keyboard_arrow_left",
            },
            nextDayIcon: {
                type: String,
                default: "keyboard_arrow_right",
            },
            defaultView: {
                type: String,
                default: "month",
            },
            headerTitle: {
                type: String,
                default: "",
            },
            description: {
                type: String,
                default: "",
            },
            headerClass: {
                type: String,
                default: "",
            },
            showHeader: {
                type: Boolean,
                default: true,
            },
            viewChange: {
                type: Boolean,
                default: true,
            },
            dateControls: {
                type: Boolean,
                default: true,
            },
            badgeClasses: {
                type: String,
                default: "bg-accent text-white text-caption q-ma-xs text-center",
            },
            height: {
                type: String,
                default: "50vh",
            },
            idField: {
                type: String,
                default: "",
            },
            titleField: {
                type: String,
                default: "",
            },
            startDateField: {
                type: String,
                default: "",
            },
            endDateField: {
                type: String,
                default: "",
            },
            startTimeField: {
                type: String,
                default: "",
            },
            endTimeField: {
                type: String,
                default: "",
            },
            imageField: {
                type: String,
                default: "",
            },
            iconField: {
                type: String,
                default: "",
            },
            colorField: {
                type: String,
                default: "",
            },
            value: {
                type: String,
                default: "",
            },
            viewEventPageType: {
                type: String,
                default: "dialog",
            },
            addEventPageType: {
                type: String,
                default: "dialog",
            },
            eventAddPage: {
                type: String,
                default: "",
            },
            eventViewPage: {
                type: String,
                default: "",
            },
            records: {
                type: Array,
                default: function () {
                    return [];
                },
            },
            viewOptions: {
                type: Array,
                default: function () {
                    return [
                        { label: "Day", value: "day" },
                        { label: "2 Day", value: "2day" },
                        { label: "3 Day", value: "3day" },
                        { label: "4 Day", value: "4day" },
                        { label: "5 Day", value: "5day" },
                        { label: "6 Day", value: "6day" },
                        { label: "Week", value: "week" },
                        { label: "month-interval", value: "month-interval" },
                        { label: "custom-interval", value: "custom-interval" },
                        { label: "Month", value: "month" },
                        { label: "day-agenda", value: "day-agenda" },
                        { label: "2day-agenda", value: "2day-agenda" },
                        { label: "3day-agenda", value: "3day-agenda" },
                        { label: "4day-agenda", value: "4day-agenda" },
                        { label: "5day-agenda", value: "5day-agenda" },
                        { label: "6day-agenda", value: "6day-agenda" },
                        { label: "month-agenda", value: "month-agenda" },
                        { label: "week-agenda", value: "week-agenda" },
                        { label: "custom-agenda", value: "custom-agenda" },

                        // { label: "scheduler", value: "scheduler" },
                        // { label: "day-scheduler", value: "day-scheduler" },
                        // { label: "2day-scheduler", value: "2day-scheduler" },
                        // { label: "3day-scheduler", value: "3day-scheduler" },
                        // { label: "4day-scheduler", value: "4day-scheduler" },
                        // { label: "5day-scheduler", value: "5day-scheduler" },
                        // { label: "6day-scheduler", value: "6day-scheduler" },
                        // { label: "week-scheduler", value: "week-scheduler" },
                        // { label: "month-scheduler", value: "month-scheduler" },
                        // { label: "custom-scheduler", value: "custom-scheduler" },
                        // { label: "resource", value: "resource" },
                        // { label: "day-resource", value: "day-resource" },
                    ];
                },
            },
        },
        mixins: [PageMixin],
        beforeMount() {
            this.updateFormatters();
        },
        data() {
            return {
                selectedDate: "",
                weekdays: [0, 1, 2, 3, 4, 5, 6],
                locale: "en-us",
                calendarView: "week",
                titleFormatter: null,
                dateFormatter: null,
            };
        },
        computed: {
            currentDateTitle() {
                if (this.titleFormatter && this.selectedDate) {
                    const date = new Date(this.selectedDate);
                    return this.titleFormatter.format(date);
                }
                return this.selectedDate;
            },
            getAllEventsByDate() {
                const map = {};
                this.getPageEvents.forEach((event) =>
                    (map[event.date] = map[event.date] || []).push(event)
                );
                return map;
            },
            getPageEvents() {
                let events = [];
                this.records.forEach((record) => {
                    let datetime = this.startDateField  ? record[this.startDateField] : "";
                   
                    if (datetime) {
                        datetime = datetime.replace("T", " ").replace("Z", "").replace("00:00:00", "00:01:00");
                        console.log(datetime);
                    }
                     
                    let dateObj = QCalendar.parseTimestamp(datetime);
                    
                    if (dateObj) {
                        let title = this.titleField ? record[this.titleField] : null;

                        let eventDate = dateObj.date;
                        let time = this.startTimeField ? record[this.startTimeField] : dateObj.time;
                        
                        let days;
                        let duration;

                        let endDate = this.endDateField ? record[this.endDateField] : "";

                        if (endDate) {
                            endDate = endDate.replace("T", " ").replace("Z", "");
                            let endDateObj = QCalendar.parseTimestamp(endDate);

                            if (!endDateObj.hasTime && this.endTimeField) {
                                endDate = endDate + " " + record[this.endTimeField];
                            }

                            let diff = Math.abs(
                                date.getDateDiff(datetime, endDate, "days")
                            );

                            if (diff > 0) {
                                days = diff;
                            } else {
                                let diff2 = date.getDateDiff( datetime, endDate, "minutes");
                                if (diff2) {
                                    duration = Math.abs(diff2);
                                }
                            }
                        }

                        let color = this.colorField ? record[this.colorField] : null;
                        if(!color){
                            color = this.eventColor;
                        }
                        let icon = this.iconField ? record[this.iconField] : null;
                        let image = this.imageField ? record[this.imageField] : null;

                        let side = "full-width";
                        let id = this.idField ? record[this.idField] : null;
                        
                        let eventDateObj = { id, title, date: eventDate, time, days, side, duration, color, icon, image};
                        let event = {...record, ...eventDateObj}; //merge page record object with event object

                        events.push(event);
                    }
                });
                return events;
            },
            intervalStart() {
                return this.intervalRange.min * (1 / this.intervalRangeStep);
            },
            intervalCount() {
                return (
                    (this.intervalRange.max - this.intervalRange.min) *
                    (1 / this.intervalRangeStep)
                );
            },
        },
        watch: {
            locale() {
                if (this.locale.length > 2) {
                    this.updateFormatters();
                }
            },
            shortMonthLabel() {
                this.updateFormatters();
            },
        },
        methods: {
            getDateEvents(dt) {
                const currentDate = QCalendar.parseTimestamp(dt);
                const events = [];
                let pageEvents = this.getPageEvents;
               
                for (let i = 0; i < pageEvents.length; ++i) {
                    let added = false;
                    const event = pageEvents[i];
                    
                    if (event.date === dt) {
                        if (event.time) {
                           
                            if (events.length > 0) {
                                // check for overlapping times
                                const startTime = QCalendar.parseTimestamp(
                                    event.date + " " + event.time
                                );
                                const endTime = QCalendar.addToDate(startTime, {
                                    minute: event.duration,
                                });
                                for (let j = 0; j < events.length; ++j) {
                                    const evt = events[j];
                                    if (evt.time) {
                                        const startTime2 = QCalendar.parseTimestamp(
                                            evt.date + " " + evt.time
                                        );
                                        const endTime2 = QCalendar.addToDate(
                                            startTime2,
                                            { minute: evt.duration }
                                        );
                                        if (
                                            QCalendar.isBetweenDates(
                                                startTime,
                                                startTime2,
                                                endTime2
                                            ) ||
                                            QCalendar.isBetweenDates(
                                                endTime,
                                                startTime2,
                                                endTime2
                                            )
                                        ) {
                                            evt.side = "right";
                                            event.side = "left";
                                            events.push(event);
                                            added = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if (!added) {
                            event.side = "full-width";
                            events.push(event);
                        }
                    } else if (event.days) {
                        // check for overlapping dates
                        const startDate = QCalendar.parseTimestamp(event.date);
                        const endDate = QCalendar.addToDate(startDate, {
                            day: event.days,
                        });
                        if (
                            QCalendar.isBetweenDates(
                                currentDate,
                                startDate,
                                endDate
                            )
                        ) {
                            event.side = "full-width";
                            events.push(event);
                            added = true;
                        }
                    }
                }
                
                return events;
            },
            getDateAgenda(dt) {
                return this.getAllEventsByDate[dt] || [];
            },
            onPrev() {
                this.$refs.calendar.prev();
            },
            onNext() {
                this.$refs.calendar.next();
            },
            setToday() {
                this.selectedDate = this.formatDate();
            },
            showEvent(event) {
                if (this.eventViewPage) {
                    let page = this.eventViewPage;
                    let pageUrl = `${page}/${event.id}`;
                    if (this.viewEventPageType == "dialog") {
                        this.openPageDialog(page, pageUrl);
                    } else if (this.viewEventPageType == "drawer") {
                        this.openPageDrawer(page, pageUrl);
                    } else {
                        this.navigateTo(pageUrl);
                    }
                }
            },
            addEvent({ scope, event }) {
                
                if (this.eventAddPage && !scope.timestamp.disabled) {
                    let modelBind = {};

                    if (this.startDateField && this.startTimeField) {
                        modelBind[this.startDateField] = scope.timestamp.date;
                        modelBind[this.startTimeField] = scope.timestamp.time;
                    }
                    else if (this.startDateField && scope.timestamp.time) {
                        let datetime = scope.timestamp.date + " " + scope.timestamp.time;
                        modelBind[this.startDateField] = datetime;
                    }
                    else if (this.startDateField){
                        modelBind[this.startDateField] = scope.timestamp.date
                    }

                    let page = this.eventAddPage;
                    if (this.addEventPageType == "dialog") {
                        this.openPageDialog(page, page, modelBind);
                    } else if (this.addEventPageType == "drawer") {
                        this.openPageDrawer(page, page, modelBind);
                    } else {
                        this.navigateTo(page);
                    }
                }
            },
            padTime(val) {
                val = Math.floor(val);
                if (val < 10) {
                    return "0" + val;
                }
                return val + "";
            },
            formatDate(date) {
                const d = date !== undefined ? new Date(date) : new Date(),
                    month = "" + (d.getMonth() + 1),
                    day = "" + d.getDate(),
                    year = d.getFullYear();
                return [year, this.padTime(month), this.padTime(day)].join("-");
            },
            badgeStyles(event, timeStartPos, timeDurationHeight) {
                const s = {};
                if (timeStartPos) {
                    s.top = timeStartPos(event.time) + "px";
                }
                if (timeDurationHeight) {
                    s.height = timeDurationHeight(event.duration) + "px";
                }
                return s;
            },
            updateFormatters() {
                try {
                    this.dateFormatter = new Intl.DateTimeFormat(
                        this.locale || undefined,
                        {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                            timeZone: "UTC",
                        }
                    );
                    this.titleFormatter = new Intl.DateTimeFormat(
                        this.locale || undefined,
                        {
                            month: this.shortMonthLabel ? "short" : "long",
                            day: "numeric",
                            year: "numeric",

                            timeZone: "UTC",
                        }
                    );
                } catch (e) {
                    // console.error('Intl.DateTimeFormat not supported')
                    this.dateFormatter = undefined;
                    this.titleFormatter = undefined;
                }
            },
        },
        mounted() {
            this.selectedDate = this.formatDate();
            if (this.defaultView) {
                this.calendarView = this.defaultView;
            }
        },
    };
</script>
<style lang="sass">
.event-badge
    border-radius:10px
    padding:8px
    cursor: pointer
    margin-right: 2px
.calendar-container
    position: relative

.q-calendar-daily__day-interval:hover
    background: rgba(0,0,255,.1)

.q-calendar-weekly__workweek:hover
    background: rgba(0,0,255,.1)

.q-calendar-weekly__day:hover
    background: rgba(0,0,255,.1)

.q-calendar-weekly__head-weekday:hover
    background: rgba(0,0,255,.1)

.q-calendar-scheduler__day:hover
    background: rgba(0,0,255,.1)

.q-calendar-resource__resource-interval:hover
    background: rgba(0,0,255,.1)

.q-calendar-daily__day:hover
    background: rgba(0,0,255,.1)

.calendar-container
    position: relative
.event
    width: 100%
    position: absolute
    font-size: 12px
    cursor: pointer
.full-width
    left: 0
    width: 100%
.left-side
    left: 0
    width: 49.75%
.right-side
    left: 50.25%
    width: 49.75%
</style>