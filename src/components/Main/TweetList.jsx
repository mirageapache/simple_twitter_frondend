import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
import moment from "moment";
import { getTweetAPI, LikeTweetAPI, UnlikeTweetAPI } from "api/main";
import { useTweet } from "context/TweetContext";
import { useReply } from "context/ReplyContext";
import { useNoti } from "context/NotiContext";
import ReplyModal from "./ReplyModal";

// svg
import { ReactComponent as IconAvatar } from "assets/icons/avatar.svg";
import { ReactComponent as IconReply } from "assets/icons/reply.svg";
import { ReactComponent as IconLike } from "assets/icons/like.svg";
import { ReactComponent as IconLikeLight } from "assets/icons/like_light.svg";

export default function TweetList({ source }) {
  const { replyModal } = useReply();
  const { tweetList } = useTweet();
  const tweet_data = tweetList.map((item) => {
    return <TweetItem key={item.id} data={item} />;
  });

  return (
    <div className="tweet_list">
      {tweet_data}
      {replyModal && <ReplyModal />}
    </div>
  );
}

function TweetItem({ data }) {
  const navigate = useNavigate();
  const { setTweet, setTweetList } = useTweet();
  const { setReplyList, setReplyModal } = useReply();
  const { setIsAlert, setNotiMessage } = useNoti();

  // 取得單一筆Tweet
  async function readTweetDetail(tweet_id, type) {
    const result = await getTweetAPI(tweet_id);
    if (result.status === 200) {
      setTweet(result.data); //設定推文資料
      setReplyList(result.data.Replies); //設定該則推文的回覆列表
      if (type === "content") {
        // 導至TweetPage
        navigate(`/tweet/:tweet_id=${tweet_id}`);
      } else {
        setReplyModal(true);
      }
    } else if (result.response.status === 404) {
      setNotiMessage({ type: "error", message: "該則推文不存在！" });
      setIsAlert(true);
      return;
    }
  }

  // like/unlike Tweet
  async function LikeToggle(tweet_id, type) {
    let result;
    if (type === "like") {
      result = await LikeTweetAPI(tweet_id);
    } else {
      result = await UnlikeTweetAPI(tweet_id);
    }
    if (result.status === 200) {
      const new_data = result.data.data.tweet;
      setTweetList((prevData) => {
        return prevData.map((item) => {
          if (item.id === new_data.id) {
            return {
              ...item,
              like_count:
                type === "like" ? item.like_count + 1 : item.like_count - 1,
              is_liked: type === "like" ? 1 : 0,
            };
          } else {
            return item;
          }
        });
      });
    }
  }

  // 設定時間格式
  let rowRelativeTime = moment(data.updatedAt)
    .startOf("second")
    .fromNow()
    .trim();
  let hourIndex = rowRelativeTime.indexOf("h");
  let minIndex = rowRelativeTime.indexOf("m");
  let secondIndex = rowRelativeTime.indexOf("seconds");
  let relativeTime;
  if (secondIndex > 0) {
    relativeTime = "now";
  } else if (minIndex > 0) {
    if (rowRelativeTime.includes("a minute ago")) {
      relativeTime = "now";
    } else {
      relativeTime = `${rowRelativeTime.slice(0, minIndex)}分鐘`;
    }
  } else if (hourIndex > 0) {
    if (rowRelativeTime.includes("an hour ago")) {
      relativeTime = "1小時";
    } else {
      relativeTime = `${rowRelativeTime.slice(0, hourIndex)}小時`;
    }
  } else {
    relativeTime = moment(data.updatedAt).format("LLL");
  }

  return (
    <div className="tweet_item">
      <div className="avatar_div">
        {data?.User?.avatar ? (
          <NavLink to={`profile/${data?.User?.id}`}>
            <img
              className="avatar_img"
              src={data?.User?.avatar}
              alt="user_avatar"
            />
          </NavLink>
        ) : (
          <IconAvatar className="avatar_img" />
        )}
      </div>
      <div className="text_div">
        <div className="card_header">
          <p className="user_name">{data?.User?.name}</p>
          <span className="user_span">
            <p className="user_account">@{data?.User?.account}</p>
            <p className="post_time">‧{relativeTime}</p>
          </span>
        </div>
        <div
          className="card_body"
          onClick={() => {
            readTweetDetail(data?.id, "content");
          }}
        >
          <p className="post_content">{data?.description}</p>
        </div>
        <div className="card_footer">
          <span className="reply_span">
            <IconReply
              className="reply_icon"
              onClick={() => {
                readTweetDetail(data?.id, "reply");
              }}
            />
            <p>{data?.reply_count}</p>
          </span>
          <span className="like_span">
            {data?.is_liked === 1 ? (
              <IconLike
                className="like_icon"
                onClick={() => {
                  LikeToggle(data.id, "unlike");
                }}
              />
            ) : (
              <IconLikeLight
                className="unlike_icon"
                onClick={() => {
                  LikeToggle(data?.id, "like");
                }}
              />
            )}
            <p>{data?.like_count}</p>
          </span>
        </div>
      </div>
    </div>
  );
}
