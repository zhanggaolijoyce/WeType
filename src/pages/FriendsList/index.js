import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useUserAvatar } from '../../contexts/UserAvatarContext'; // 导入上下文
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import './styles.css'; 
import avatar1 from '../../assets/images/avatar_1.png'; // 为了展示，后端弄好以后就可以删掉
import avatar2 from '../../assets/images/avatar_2.png'; // 为了展示，后端弄好以后就可以删掉
import avatar3 from '../../assets/images/avatar_3.png'; // 为了展示，后端弄好以后就可以删掉
import avatar4 from '../../assets/images/avatar_4.png'; // 为了展示，后端弄好以后就可以删掉
import avatar5 from '../../assets/images/avatar_5.png'; // 为了展示，后端弄好以后就可以删掉


function FriendList( {theme} ) {
  const email = useLocation().state.email;

  const { userAvatar } = useUserAvatar(); // 此处 userAvatar 未使用
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]); // 存储好友数据的状态
  const backButtonColor = theme === 'PinkGradient'  ? '#e27396' : '#007bff'; //Set the return key color according to the theme

  // 模拟从后端获取数据的函数 （搞后端的时候只要改这个function就行了）
  const fetchFriends = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
            { id: 1, name: 'Alice', avatar: avatar1, email: 'Alice2023@gmail.com'}, 
            { id: 2, name: 'Bob', avatar: avatar2, email: 'Bob2023@gmail.com' },   
            { id: 3, name: 'Charlie', avatar: avatar3, email: 'Charlie2023@gmail.com' }, 
            { id: 4, name: 'Diana', avatar: avatar4, email: 'Diana2023@gmail.com' },   
            { id: 5, name: 'Eve', avatar: avatar5,  email: 'Eve2023@gmail.com' },    
        ]);
      }); // 延迟1秒来模拟网络请求
    });
  };

  useEffect(() => {
    fetchFriends().then(data => {
      setFriends(data); // 更新状态
    });
  }, []); // 空依赖数组表示这个效果仅在组件挂载时运行一次

  const handleGoBack = () => {
    navigate('/home', { state: { email: email } }); // 返回主页
  };

  return (
    <div className="practice-container">
      <header>
        <Tooltip title="Back">
          <Button
            startIcon={<ArrowCircleLeftIcon style={{ color: backButtonColor, fontSize: '2rem' }} />}
            onClick={handleGoBack}
            className="arrow-left-icon"
          >
          </Button>
        </Tooltip>
        <h1 className="practice-title">Friend List</h1>
      </header>
      <div className="content">
          <div className="friend-list">
              {friends.map(friend => (
                <div key={friend.id} className="friend-item">
                    <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
                    <div className="friend-info">
                      <div className="friend-name">{friend.name}</div>
                      <div className="friend-email">{`<${friend.email}>`}</div> {/* 显示邮箱地址 */}
                    </div>
                </div>
              ))}
      </div>

      </div>
    </div>
  );
}

export default FriendList;
