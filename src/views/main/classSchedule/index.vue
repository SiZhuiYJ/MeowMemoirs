<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import Folding from "@/layouts/components/Header/components/LoadListener/Folding/index.vue";
import {
    getCurrentDate,
    formatDateToMMDD,
    getDateFormatYYYYMMDD,
    getDateDaysBefore,
    numberToChinese,
    solarToLunar,
    isFestival
} from "@/utils/calendar";
import type { Class, Event } from "@/libs/api/class/type";
import type { CalendarDateType, CalendarInstance } from "element-plus";
import useClass from "@/features/Curriculum/useClass";
const { getClass, initializeData, } = useClass();// getClassById
import useRoutine from "@/features/Curriculum/useRoutine";
// const { addRoutine } = useRoutine();
import useWeek from "@/features/Curriculum/useWeek";
const { weekNumber, getCurrentWeek, setWeekNumber } = useWeek();// , setStartDate
import useMark from "@/features/Curriculum/useMark";
// const { addMark } = useMark();
import useWeekData from "@/features/Curriculum/useWeekData";
const { weekList, } = useWeekData();//setWeeklong

const calendar = ref<CalendarInstance>();
const selectDate = (val: CalendarDateType) => {
    if (!calendar.value) return;
    calendar.value.selectDate(val);
};

// 出生日期转生日
const getdayByBirth = (date: Event) => {
    if (date.type === "birthday")
        return (
            new Date().getFullYear() +
            "-" +
            date.date.split("-")[1] +
            "-" +
            date.date.split("-")[2]
        );
    else return date.date;
};
// 今日距离某个期多少天给出天数包括正负
const getDaysBetween = (date1: string, date2: string) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    const diffDays = (firstDate.getTime() - secondDate.getTime()) / oneDay;
    return diffDays;
};

import ClassDetail from "@/views/console/calendar/components/ClassDialog.vue";
import { useScreenStore } from "@/utils/screen";
// 添加 OR 修改对话框Ref
const ClassRef = ref();

//课程详情
const classDetail = ref<Class>();
// 显示课程详情
function showClassDetail(data: Class) {
    classDetail.value = data;
    ClassRef.value.handleOpen();
}


watch(
    () => weekNumber,
    weekNumber => {
        // setWeekNumber(weekNumber.toString())
        console.log(weekNumber)
    }
);


// 屏幕状态
const folding = ref();

// 加载完成调用
onMounted(async () => {
    initializeData();
    if (useScreenStore().isMobile.value)
        if (window.innerWidth > 768) folding.value.toggleDetails();
});
</script>
<template>
    <!-- 课程控制器 -->
    <div class="confession-class-controller">
        <!-- 当前周数 -->
        <Folding ref="folding" v-if="useScreenStore().isMobile.value">
            <div class="current-week">
                当前日期：
                <p style="color: var(--el-color-primary)">
                    {{ formatDateToMMDD(weekNumber) }}
                </p>
                <p> </p>
                当前周数：
            </div>
            <template #toggle>
                <div class="current-week">
                    第{{ numberToChinese(getCurrentWeek) }}周
                </div>
            </template>
            <template #container>
                <el-calendar v-model="weekNumber">
                    <template #date-cell="{ data }">
                        <div>
                            <div class="solar">
                                {{ data.day.split("-")[2] }}
                            </div>
                            <div class="lunar" :class="{ festival: isFestival(data) }">
                                {{ solarToLunar(data) }}
                            </div>
                            <!-- 标记 -->
                            <div class="mark">
                                <p v-if="data.day === '2025-09-08'">⭐</p>
                                <p v-if="data.day === getCurrentDate()">今</p>
                                <p v-if="data.isSelected">✔️</p>
                            </div>
                        </div>
                    </template>
                </el-calendar>
                <div class="important-day">
                    <i v-for="day in useMark().markDate.value" :key="day.id" :style="{ borderLeftColor: day.color }"
                        class="day-item" @click="setWeekNumber(getdayByBirth(day))">
                        {{ day.info }}·
                        {{ day.date }}·
                        {{ getDaysBetween(getdayByBirth(day), getDateFormatYYYYMMDD(new Date())) >= 0 ? "还有" : "过去" }}
                        {{ Math.abs(getDaysBetween(getdayByBirth(day), getDateFormatYYYYMMDD(new Date()))) }}天
                    </i>
                </div>
            </template>
        </Folding>
        <div class="week-controller" v-else>
            <el-calendar v-model="weekNumber" ref="calendar">
                <template #header="{ date }">
                    <span>{{ date }}-上课第{{
                        numberToChinese(getCurrentWeek)
                        }}周</span>
                    <el-button-group>
                        <el-button size="small" @click="selectDate('prev-month')">
                            上个月
                        </el-button>
                        <el-button size="small" @click="selectDate('today')">今天</el-button>
                        <el-button size="small" @click="selectDate('next-month')">
                            下个月
                        </el-button>
                    </el-button-group>
                </template>
                <template #date-cell="{ data }">
                    <div>
                        <div class="solar">{{ data.day.split("-")[2] }}</div>
                        <div class="lunar" :class="{ festival: isFestival(data) }">
                            {{ solarToLunar(data) }}
                        </div>
                        <!-- 标记 -->
                        <div class="mark">
                            <p v-if="data.day === '2025-09-08'">⭐</p>
                            <p v-if="data.day === getCurrentDate()">今</p>
                            <p v-if="data.isSelected">✔️</p>
                        </div>
                    </div>
                </template>
            </el-calendar>
            <div class="important-day">
                <i v-for="day in useMark().markDate.value" :key="day.id" :style="{ borderLeftColor: day.color }"
                    class="day-item" @click="setWeekNumber(getdayByBirth(day))">
                    {{ day.info }}·{{ day.date }}·{{
                        getDaysBetween(
                            getdayByBirth(day),
                            getDateFormatYYYYMMDD(new Date())
                        ) >= 0
                            ? "还有"
                            : "过去"
                    }}{{
                        Math.abs(
                            getDaysBetween(
                                getdayByBirth(day),
                                getDateFormatYYYYMMDD(new Date())
                            )
                        )
                    }}天
                </i>
            </div>
        </div>
        <div class="confession-class">
            <div class="confession-class-grid">
                <div class="confession-time-item" key="-1">
                    <div class="time-header">节次
                        <div class="date-header">(日期)</div>
                    </div>

                    <div class="time-slot" v-for="(number, index) in useRoutine().routineList
                        .value" :key="number">
                        <span class="time-slot-number">{{ numberToChinese(index + 1) }}节</span>
                        <span class="time-slot-time">{{ "{" + number + "}" }}</span>
                    </div>
                </div>
                <!-- 周次循环 -->
                <div class="confession-class-item" v-for="(item, weekIndex) in weekList" :class="[
                    weekNumber.getDay() === (weekIndex + 1) % 7 ? 'class-activate' : '']" :key="weekIndex + 1">
                    <div class="day-header">
                        {{ item }}
                        <div class="date-header">
                            ({{ formatDateToMMDD(getDateDaysBefore(weekNumber, weekNumber.getDay() - weekIndex - 1)) }})
                        </div>
                    </div>
                    <div v-for="(_, sectionIndex) in useRoutine().routineList
                        .value" :key="sectionIndex" class="course-slot">
                        <template v-if="getClass(getCurrentWeek, weekIndex + 1, sectionIndex + 1)">
                            <div class="course-item"
                                :style="{ borderLeftColor: getClass(getCurrentWeek, weekIndex + 1, sectionIndex + 1)!.color }"
                                @click="showClassDetail(getClass(getCurrentWeek, weekIndex + 1, sectionIndex + 1)!)">
                                <el-text class="course-name" :line-clamp="useScreenStore().isMobile.value ? 2 : 1">
                                    {{ getClass(getCurrentWeek, weekIndex + 1, sectionIndex + 1)?.name }}
                                </el-text>
                                <el-text class="course-details" :line-clamp="useScreenStore().isMobile.value ? 3 : 2">
                                    {{ getClass(getCurrentWeek, weekIndex + 1, sectionIndex + 1)?.location }}/
                                    {{ getClass(getCurrentWeek, weekIndex + 1, sectionIndex + 1)?.teacher }}
                                </el-text>
                            </div>
                        </template>
                        <template v-else>
                            <div class="empty-slot">+</div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ClassDetail ref="ClassRef" title="课程详情" :disabled="true" :classDetail="classDetail!" />
</template>
<style scoped lang="scss">
.course-slot {
    background-color: white;
}

.dark .class-details {
    background-color: rgb(33, 33, 33);
}

.dark .course-slot {
    background-color: rgb(133, 133, 133);
}

.confession-class-controller {
    background-color: #fff;
    display: flex;
    align-items: center;

    .week-controller {
        min-width: 300px;
        max-width: 500px;
    }

    @media (max-width: 768px) {
        flex-direction: column;
    }
}

.important-day {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2px;
    padding: 0 20px;

    .day-item {
        padding: 2px;
        border-left: 4px solid #fff;
        font-size: 12px;
    }

    @media (max-width: 768px) {
        padding: 0 20px 10px;

        .day-item {
            font-size: 8px;
        }
    }
}

.dark .confession-class-controller {
    background-color: rgb(33, 33, 33);
}

.confession-class {
    background: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

    .confession-class-grid {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 1px;
        background-color: #eef2f7;

        .confession-time-item,
        .confession-class-item {
            height: 100vh;
            gap: 1px;
            background-color: #eef2f7;
            display: grid;
            // 固定前两行高度
            grid-template-rows: 30px;
            // 剩余行自动平分空间
            grid-auto-rows: 1fr;
            // 可选：设置最小高度防止内容溢出
            grid-auto-flow: row;

            @media (max-width: 768px) {
                grid-template-rows: 40px;
            }

            .time-slot {
                background: var(--el-color-primary-light-4);
                padding: 1px;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                color: #f8fafd;
                font-style: italic;

                .time-slot-number {
                    font-size: 16px;

                    @media (max-width: 768px) {
                        font-size: 10px;
                    }
                }

                .time-slot-time {
                    font-size: 10px;

                    @media (max-width: 768px) {
                        font-size: 5px;
                    }
                }
            }

            .time-header,
            .day-header {
                background: var(--el-color-primary);
                color: white;
                padding: 5px;
                text-align: center;
                font-weight: 500;
                display: flex;
                align-items: center;

                .date-header {
                    font-size: 12px;
                    background: var(--el-color-primary);
                    color: white;
                }

                @media (max-width: 768px) {
                    padding: 1px;
                    flex-direction: column;

                    .date-header {
                        font-size: 10px;
                    }
                }
            }



            .course-slot {
                min-height: 50px;
                padding: 1px;
                position: relative;

                .course-item {
                    background: #e3f2fd;
                    border-left: 4px solid #fff;
                    border-radius: 4px;
                    padding: 5px;
                    font-size: 0.9rem;
                    height: calc(100% - 10px);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;

                    .course-name {
                        font-weight: 600;
                        color: #1565c0;

                        @media (max-width: 768px) {
                            font-size: 9px;
                        }
                    }

                    .course-details {
                        font-size: 0.7rem;
                        color: #546e7a;

                        @media (max-width: 768px) {
                            font-size: 7px;
                        }
                    }

                    @media (max-width: 768px) {
                        padding: 1px;
                        height: calc(100% - 2px);
                    }
                }

                .empty-slot {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-style: italic;
                    height: 100%;
                    transition: all 0.3s ease; // 全部动画.3
                    font-size: 0px;

                    &:hover {
                        height: calc(100% - 6px);
                        font-size: 25px;
                        border: 3px dashed var(--el-color-primary); // 边框为虚线
                        color: var(--el-color-primary);
                    }
                }
            }
        }

        .class-activate {
            .course-slot {
                background: var(--el-color-primary-light-7);
            }
        }
    }

    @media (max-width: 768px) {
        padding: 0;
    }
}

:deep(.el-calendar-table__row) {
    .is-selected {
        border: 2px dashed var(--el-color-primary) !important;
    }

    .is-today {
        border: 2px solid var(--el-color-primary) !important;
    }

    .is-today,
    .is-selected {
        .el-calendar-day {
            height: 81px !important;

            @media (max-width:768px) {
                height: 52px !important;
            }
        }

    }

    .prev,
    .current,
    .next {
        .el-calendar-day {
            padding: 5px 0 0 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 85px;

            @media (max-width: 768px) {
                height: 56px;
            }

            div {
                display: flex;
                flex-direction: column;
                align-items: center;

                .solar {
                    font-size: 16px;

                    @media (max-width: 768px) {
                        font-size: 12px;
                    }
                }

                .lunar {
                    font-size: 16px;

                    @media (max-width: 768px) {
                        font-size: 8px;
                    }
                }

                .mark {
                    display: flex;
                    flex-direction: row;
                    font-size: 16px;

                    @media (max-width: 768px) {
                        font-size: 10px;

                        p {
                            width: 50%;
                        }
                    }
                }
            }
        }
    }
}





// 日历
.current-week {
    padding: 10px 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
</style>
