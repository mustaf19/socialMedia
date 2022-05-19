import axios from "axios";
import { useRef } from "react";
import { useContext , useState} from "react";
import { AuthContext } from "../../context/AuthContext";

import "./updateAcc.css";

function UpdateAcc() {
    const { user: currentUser } = useContext(AuthContext);
    const desc = useRef(); 
  const city = useRef();
  const country = useRef();
  const relationship = useRef();
  const [file, setFile] = useState(null);
  const handleClick = async (e) => {
    e.preventDefault();
    
      const data1 = {
        userId: currentUser._id,
        desc: desc.current.value,
        city: city.current.value,
        country: country.current.value,
        relationship: relationship.current.value,
      };
      if (file) {
        const data = new FormData();
        const fileName = Date.now() + file.name;
        data.append("name", fileName);
        data.append("file", file);
        data1.profilePicture = fileName;
        console.log(data);
        try {
          await axios.post("/upload", data);
        } catch (err) {}
      }
      try {
        await axios.put(`/users/${currentUser._id}`, data1);
        window.location=`/profile/${currentUser.username}`;
      } catch (err) {
        console.log(err);
      }
    
  };
    return (
        <div>
           <form onSubmit={handleClick} className="updateBox">
            <div>
            <div>
                Profile Picture:
            </div>
            <input
                // style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            
            <div>
            <div>
                City:
            </div>
            <input type="text" ref={city} placeholder="City" className="updateInput" /><br />
            </div>
            <div>
            <div>
                Country:
            </div>
            <input type="text" ref={country} placeholder="Country" className="updateInput"/><br />
            </div>
            <div> 
            <div>
                Bio:
            </div>
            <textarea ref={desc} cols="30" rows="8" className="descInput"></textarea>
            </div>
            <br />
            <div>
            <div>
                Relationship:
            </div>
            <select className="updateInput" ref={relationship}>
                <option value="1">Single</option>
                <option value="2">Married</option>
                <option value="">Do not want to disclose!</option>
            </select>
            </div>
            <br />
            <input type="submit" value="Update" className="updateButton"/>
            </form> 
        </div>
    )
}

export default UpdateAcc;
