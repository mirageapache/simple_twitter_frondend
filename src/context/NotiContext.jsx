import { createContext, useContext, useState } from "react";

const defaultValue = {
  is_alert: false,
  noti_message: {type:'',message:''}
};
// noti_message: {type:'success',message:'登入成功！'}
// type: 'success' / 'error' / 'warning' / 'info'

const NotiContext = createContext(defaultValue);
export const useNoti = () => useContext(NotiContext);

export const NotiProvider = ({ children }) => {
  const [is_alert, setIsAlert] = useState(false); //顯示通知
  const [noti_message, setNotiMessage] = useState({type:'',message:''}); //通知內容
  
  return (
    <NotiContext.Provider 
      value={{
          is_alert,
          setIsAlert,
          noti_message,
          setNotiMessage, 
        }}
      >
      {children}
    </NotiContext.Provider>
  );
};
