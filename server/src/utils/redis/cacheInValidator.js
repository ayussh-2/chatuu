import redisController from "./redisController.js";

const CACHE_KEYS = {
    RECENT_CHATS: (userId) => `recent_chats:${userId}`,
    NON_FRIENDS: (userId) => `non_friends:${userId}`,
    USER_PROFILE: (userId) => `user_profile:${userId}`,
    CONVERSATION: (conversationId) => `conversation:${conversationId}`,
    MESSAGES: (conversationId) => `messages:${conversationId}`,
    FRIEND_REQUESTS: (userId) => `friend_requests:${userId}`,
    USER_SETTINGS: (userId) => `user_settings:${userId}`,
};

const INVALIDATION_EVENTS = {
    MESSAGE_SENT: "MESSAGE_SENT",
    MESSAGE_DELETED: "MESSAGE_DELETED",
    CONVERSATION_UPDATED: "CONVERSATION_UPDATED",
    FRIEND_REQUEST_SENT: "FRIEND_REQUEST_SENT",
    FRIEND_REQUEST_RESPONDED: "FRIEND_REQUEST_RESPONDED",
    USER_UPDATED: "USER_UPDATED",
    USER_STATUS_CHANGED: "USER_STATUS_CHANGED",
};

class CacheInvalidator {
    static async invalidateByEvent(event, params) {
        const invalidationStrategies = {
            [INVALIDATION_EVENTS.MESSAGE_SENT]: async ({
                conversationId,
                participantIds,
            }) => {
                await this.invalidateMultiple([
                    ...participantIds.map((userId) =>
                        CACHE_KEYS.RECENT_CHATS(userId)
                    ),
                    CACHE_KEYS.MESSAGES(conversationId),
                    CACHE_KEYS.CONVERSATION(conversationId),
                ]);
            },

            [INVALIDATION_EVENTS.MESSAGE_DELETED]: async ({
                conversationId,
                participantIds,
            }) => {
                await this.invalidateMultiple([
                    ...participantIds.map((userId) =>
                        CACHE_KEYS.RECENT_CHATS(userId)
                    ),
                    CACHE_KEYS.MESSAGES(conversationId),
                ]);
            },

            [INVALIDATION_EVENTS.FRIEND_REQUEST_SENT]: async ({
                senderId,
                receiverId,
            }) => {
                await this.invalidateMultiple([
                    CACHE_KEYS.NON_FRIENDS(senderId),
                    CACHE_KEYS.NON_FRIENDS(receiverId),
                    CACHE_KEYS.FRIEND_REQUESTS(senderId),
                    CACHE_KEYS.FRIEND_REQUESTS(receiverId),
                ]);
            },

            [INVALIDATION_EVENTS.FRIEND_REQUEST_RESPONDED]: async ({
                senderId,
                receiverId,
            }) => {
                await this.invalidateMultiple([
                    CACHE_KEYS.NON_FRIENDS(senderId),
                    CACHE_KEYS.NON_FRIENDS(receiverId),
                    CACHE_KEYS.FRIEND_REQUESTS(senderId),
                    CACHE_KEYS.FRIEND_REQUESTS(receiverId),
                ]);
            },

            [INVALIDATION_EVENTS.USER_UPDATED]: async ({
                userId,
                relatedUserIds = [],
            }) => {
                const keysToInvalidate = [
                    CACHE_KEYS.USER_PROFILE(userId),
                    CACHE_KEYS.NON_FRIENDS(userId),
                    ...relatedUserIds.map((relatedId) =>
                        CACHE_KEYS.NON_FRIENDS(relatedId)
                    ),
                ];
                await this.invalidateMultiple(keysToInvalidate);
            },

            [INVALIDATION_EVENTS.USER_STATUS_CHANGED]: async ({
                userId,
                relatedUserIds,
            }) => {
                await this.invalidateMultiple([
                    ...relatedUserIds.map((relatedId) =>
                        CACHE_KEYS.RECENT_CHATS(relatedId)
                    ),
                ]);
            },

            [INVALIDATION_EVENTS.NOTIFICATION_RECEIVED]: async ({ userId }) => {
                await this.invalidate(CACHE_KEYS.NOTIFICATIONS(userId));
            },
        };

        const strategy = invalidationStrategies[event];
        if (strategy) {
            await strategy(params);
        } else {
            console.warn(`No invalidation strategy found for event: ${event}`);
        }
    }

    static async invalidateMultiple(keys) {
        try {
            await Promise.all(keys.map((key) => redisController.delete(key)));
        } catch (error) {
            console.error("Error invalidating multiple cache keys:", error);
        }
    }

    static async invalidate(key) {
        try {
            await redisController.delete(key);
        } catch (error) {
            console.error("Error invalidating cache key:", error);
        }
    }

    static async invalidatePattern(pattern) {
        try {
            await redisController.deletePattern(pattern);
        } catch (error) {
            console.error("Error invalidating cache pattern:", error);
        }
    }
}

export { CacheInvalidator, INVALIDATION_EVENTS, CACHE_KEYS };
