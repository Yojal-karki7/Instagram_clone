import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: "realTimeNotification",
    initialState: {
        likeNotification: [],
        messageNotification: [],
    },
    reducers: {
        setLikeNotification(state, action) {
            if (action.payload.type === "like") {
                state.likeNotification.push(action.payload);
            } else if (action.payload.type === "dislike") {
                state.likeNotification = state.likeNotification.filter(
                    (item) => item.userId !== action.payload.userId
                );
            }
        },
        setMessageNotification: (state, action) => {
            if (!state.messageNotification) {
                state.messageNotification = [];
            }

            // ✅ Remove objects that only contain "count"
            const filteredMessages = Array.isArray(action.payload)
                ? action.payload.filter((msg) => msg.type === "message")
                : action.payload.type === "message"
                ? [action.payload]
                : [];

            state.messageNotification.push(...filteredMessages);
        },
        clearLikeNotifications: (state) => {
            state.likeNotification = [];
        },
        clearMessageNotifications(state, action) {
            state.messageNotification = []
        }
    },
});

export const { setLikeNotification, setMessageNotification, clearLikeNotifications, clearMessageNotifications } = rtnSlice.actions;
export default rtnSlice.reducer;
