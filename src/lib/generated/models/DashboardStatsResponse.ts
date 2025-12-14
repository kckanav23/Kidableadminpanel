/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NextSession } from './NextSession';
import type { TodayMood } from './TodayMood';
export type DashboardStatsResponse = {
    /**
     * Number of active goals
     */
    activeGoalsCount?: number;
    /**
     * Latest session number
     */
    totalSessions?: number;
    nextSession?: NextSession;
    /**
     * Number of active homework items
     */
    activeHomeworkCount?: number;
    /**
     * Number of homework marked as worked
     */
    homeworkWorkedCount?: number;
    todayMood?: TodayMood;
};

