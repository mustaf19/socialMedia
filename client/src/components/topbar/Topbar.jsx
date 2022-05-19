import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext , useState , useEffect,useRef} from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar() {
  const [user, setUser] = useState({});
  const { user:currentUser } = useContext(AuthContext);
  const sear=useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${currentUser._id}`);
      setUser(res.data);
    };
    fetchUser();
  }, [currentUser._id]);
  const logout = () => {
    window.localStorage.clear();
    window.location.href = "/login";
  }
  const Go =()=>{
    window.location.href = `/profile/${sear.current.value}`;
    sear.current.value=""
  }
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Smart Social Media</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
            ref={sear}
          />
          <div className="sicon">
          <Search className="searchIcon1" onClick={Go} />
        </div>
        </div>
        
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <Link to="/" className="hom"><span className="topbarLink">Homepage</span></Link>
          <span className="topbarLink" onClick={logout}>Logout</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span></span>
          </div>
          <div className="topbarIconItem">
            <Link to={`/messenger`} style={{color:"white"}}>
            <Chat />
            <span></span>
            </Link>
          </div>

          <div className="topbarIconItem">
            <Notifications />
            <span></span>
          </div>
        </div>
        <Link to={`/profile/${currentUser.username}`} className="linktoprofile">
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
          <div className="topname">{user.username}</div>
        </Link>
      </div>
    </div>
  );
}
