/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MoodEntryRequest = {
    /**
     * Parent id (optional)
     */
    parentId?: string;
    /**
     * Entry date (defaults to today if null)
     */
    entryDate?: string;
    /**
     * Mood
     */
    mood: MoodEntryRequest.mood;
    /**
     * Zone
     */
    zone?: MoodEntryRequest.zone;
    /**
     * Energy level
     */
    energyLevel?: MoodEntryRequest.energyLevel;
    /**
     * Emoji
     */
    emoji?: string;
    /**
     * Notes
     */
    notes?: string;
};
export namespace MoodEntryRequest {
    /**
     * Mood
     */
    export enum mood {
        VERY_HAPPY = 'very_happy',
        HAPPY = 'happy',
        OKAY = 'okay',
        SAD = 'sad',
        VERY_SAD = 'very_sad',
    }
    /**
     * Zone
     */
    export enum zone {
        GREEN = 'green',
        YELLOW = 'yellow',
        ORANGE = 'orange',
        RED = 'red',
        BLUE = 'blue',
    }
    /**
     * Energy level
     */
    export enum energyLevel {
        HIGH = 'high',
        MEDIUM = 'medium',
        LOW = 'low',
    }
}

