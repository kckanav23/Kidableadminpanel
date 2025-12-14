/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MoodEntryResponse = {
    /**
     * Mood entry id
     */
    id?: string;
    /**
     * Client id
     */
    clientId?: string;
    /**
     * Parent id
     */
    parentId?: string;
    /**
     * Entry date
     */
    entryDate?: string;
    /**
     * Mood
     */
    mood?: MoodEntryResponse.mood;
    /**
     * Zone
     */
    zone?: MoodEntryResponse.zone;
    /**
     * Energy level
     */
    energyLevel?: MoodEntryResponse.energyLevel;
    /**
     * Emoji
     */
    emoji?: string;
    /**
     * Notes
     */
    notes?: string;
    /**
     * Created at
     */
    createdAt?: string;
};
export namespace MoodEntryResponse {
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

