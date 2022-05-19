import "./post.css";
// import { MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useState ,useRef} from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [com, setCom] = useState(post.comments.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [comme,setComme] = useState(post.comments);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);
  const comment = useRef();

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);
  useEffect(() => {
    setComme(post.comments);
  }, [currentUser._id, post.comments]);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    }; 
    fetchUser();
  }, [post.userId,comme]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  const addComment =async () => {
    try {
      const u=await axios.get(`/users?userId=${currentUser._id}`)
      if(u.data.rating>1){
        const z=await axios.put("/posts/" + post._id + "/comment", {userName: currentUser.username,comment:comment.current.value,userProfile:user.profilePicture });
      if(z.data!=='toxic'){
        setComme([...comme,{
          uid:currentUser.username,
          com:comment.current.value,
          pic:currentUser.profilePicture,
        }])
        comment.current.value=null;
        
        setCom(com+1);
      }else{
        comment.current.value=null;
      alert("Warning : Your comment is categorized as toxic! your rating is decreased by 0.5 , If you will have rating lesser than 1 you will be restricted from comments");
      await axios.put(`/users/rating/${currentUser._id}`)
      }
      }else{
        comment.current.value=null;
        alert("Your profile has rating 1, therefore you are restricted from comments!!!");
        
      }
      
    } catch (err) { console.log(err)}
  }

  const delPost = async () =>{
    try{
      await axios.delete(`/posts/${post._id}`);
      window.location.reload();
    }catch(err){
      console.log(err);
    }
  }
  
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft"> 
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            {post.userId===currentUser._id?<button onClick={delPost}>Delete Post</button>:""}
            
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText" >{com} comments</span>
          </div>
          
          <div>
            <input type="text" ref={comment} placeholder="Add a comment..." /><button onClick={addComment}>Post</button>
          </div>
        </div>
        <div className="comments">
          {
            comme.map((c) => (<>
                          
              
              <p className="comm"><img
                className="postProfileImg"
                src={
                  c.pic
                    ? PF + c.pic
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
              <span className="namepic" style={{"font-weight":"bold"}}>{c.uid}:{c.com}</span>
              </p>
              
              
              </>))
          
          }
        </div>
        
      </div>
    </div>
  );
}
