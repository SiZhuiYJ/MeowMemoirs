<script setup lang="ts">
import { onMounted, ref } from "vue";

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
import useClass from "@/components/Curriculum/useClass"
const { getClass, initializeData, getClassById } = useClass()
import useRoutine from "@/components/Curriculum/useRoutine"
const { addRoutine } = useRoutine()
import useWeek from "@/components/Curriculum/useWeek"
const { setStartDate, setWeekNumber } = useWeek()
import useMark from "@/components/Curriculum/useMark"
const { addMark } = useMark()
import useWeekData from "@/components/Curriculum/useWeekData"
const { setWeeklong } = useWeekData()

// const { getClass, setWeekNumber, initializeData } = useClassStore();
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
function showClassDetail(id: number) {
    classDetail.value = getClassById(id);
    ClassRef.value.handleOpen();
}

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
                    {{ formatDateToMMDD(useWeek().weekNumber.value) }}
                </p>
                <p>-</p>
                当前周数：
            </div>
            <template #toggle>
                <div class="current-week">
                    第{{ numberToChinese(useWeek().getCurrentWeek.value) }}周
                </div>
            </template>
            <template #container>
                <el-calendar v-model="useWeek().weekNumber.value">
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
                        {{ day.info }}·{{ day.date }}·{{ getDaysBetween(getdayByBirth(day), getDateFormatYYYYMMDD(new
                            Date())) >= 0
                            ? "还有"
                            : "过去"
                        }}{{ Math.abs(getDaysBetween(getdayByBirth(day), getDateFormatYYYYMMDD(new Date()))) }}天
                    </i>
                </div>
            </template>
        </Folding>
        <div class="week-controller" v-else>
            <el-calendar v-model="useWeek().weekNumber.value" ref="calendar">
                <template #header="{ date }">
                    <span>{{ date }}-上课第{{
                        numberToChinese(useWeek().getCurrentWeek.value)
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
                    {{ day.info }}·{{ day.date }}·{{ getDaysBetween(getdayByBirth(day), getDateFormatYYYYMMDD(new
                        Date()))
                        >= 0 ?
                        "还有" : "过去"
                    }}{{ Math.abs(getDaysBetween(getdayByBirth(day), getDateFormatYYYYMMDD(new Date()))) }}天
                </i>
            </div>
        </div>
        <div class="confession-class">
            <div class="confession-class-grid">
                <div class="confession-time-item" key="-1">
                    <div class="time-header">节次</div>
                    <div class="date-header">日期</div>
                    <div class="time-slot" v-for="(number, index) in useRoutine().routineList.value" :key="number">
                        <span class="time-slot-number">{{ numberToChinese(index + 1) }}节</span>
                        <span class="time-slot-time">{{
                            "{" + number + "}"
                        }}</span>
                    </div>
                </div>
                <!-- 周次循环 -->
                <div class="confession-class-item" v-for="(item, weekIndex) in useWeekData().weekList.value" :class="[
                    useWeek().weekNumber.value.getDay() === (weekIndex + 1) % 7 ? 'class-activate' : '']"
                    :key="weekIndex + 1" :title="useWeek().weekNumber.value.getDay() + ':' + ((weekIndex + 1) % 7)
                        ">
                    <div class="day-header">{{ item }}{{ weekIndex }}</div>
                    <div class="date-header">
                        {{ formatDateToMMDD(getDateDaysBefore(useWeek().weekNumber.value,
                            useWeek().weekNumber.value.getDay() -
                            weekIndex -
                            1)) }}
                    </div>
                    <div v-for="(number, index) in useRoutine().routineList.value" :key="index" class="course-slot">
                        <template v-if="getClass(useWeek().getCurrentWeek.value, weekIndex + 1, index + 1)">
                            <div class="course-item"
                                :style="{ borderLeftColor: getClass(useWeek().getCurrentWeek.value, weekIndex + 1, index + 1)!.color }"
                                @click="() => { showClassDetail((useWeek().getCurrentWeek.value, weekIndex + 1, index + 1)); console.log(getClass(useWeek().getCurrentWeek.value, weekIndex + 1, index + 1)); }">
                                <el-text class="course-name" line-clamp="1">
                                    {{ getClass(useWeek().getCurrentWeek.value, weekIndex + 1, index + 1)?.name }}
                                </el-text>
                                <el-text class="course-details" line-clamp="3">
                                    {{ getClass(useWeek().getCurrentWeek.value, weekIndex + 1, index + 1)?.location }}
                                    /
                                    {{ getClass(useWeek().getCurrentWeek.value, weekIndex + 1, index + 1)?.teacher }}
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
    <ClassDetail ref="ClassRef" title="课程详情" :disabled="false" :classDetail="classDetail!" />
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
    width: 100%;

    .confession-class-grid {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 1px;
        background-color: #eef2f7;

        .confession-time-item,
        .confession-class-item {
            display: flex;
            gap: 1px;
            background-color: #eef2f7;
            flex-direction: column;

            .time-slot {
                background: var(--el-color-primary-light-4);
                padding: 1px;
                font-weight: 500;
                height: 50px;
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

                >p {
                    font-size: 12px;
                }
            }

            .date-header {
                height: 20px;
                font-size: 12px;
                background: var(--el-color-primary);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;

                @media (max-width: 768px) {
                    font-size: 10px;
                }
            }

            .course-slot {
                height: 50px;
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

                    .course-name {
                        font-weight: 600;
                        margin-bottom: 2px;
                        color: #1565c0;

                        @media (max-width: 768px) {
                            font-size: 10px;
                            margin-bottom: 1px;
                        }
                    }

                    .course-details {
                        font-size: 0.8rem;
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
                    color: #bdc3c7;
                    font-style: italic;
                    height: 100%;
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

::v-deep(.el-calendar-day) {
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

// 日历
.current-week {
    padding: 10px 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
</style>
