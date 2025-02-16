import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likeNotification: [],
        messageNotification: [],
    },
    reducers: {
        setLikeNotification(state, action) {
            if(action.payload.type === 'like') {
                state.likeNotification.push(action.payload);
            } else if(action.payload.type === 'dislike') {
                state.likeNotification = state.likeNotification.filter((item) => item.userId !== action.payload.userId)
            }
        },
        setMessageNotification(state, action) {
                // ✅ Ensure messageNotification is always an array
                if (!state.messageNotification) {
                  state.messageNotification = [];
                }
                state.messageNotification.push(action.payload);
              },
        }
    }
);

export const {setLikeNotification, setMessageNotification} = rtnSlice.actions;
export default rtnSlice.reducer;