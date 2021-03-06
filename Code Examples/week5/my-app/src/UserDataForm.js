import React, {useState, useEffect} from 'react';

function UserDataForm(props){

    const [userData, setUserData] = useState(null);

    useEffect(()=>{
        setUserData({
            fullName: "Jason Borne",
            programName: "Computer Programming and Analysis",
            campus: "newnham",
            enrolled: true,
            housing: "off campus"   
        });
    },[]);

    const handleSubmit = (e)=>{
        console.log("submitted")
        e.preventDefault();
        console.log('The Form Was Submitted: ' + JSON.stringify(userData));
    }

    const handleChange = (e)=>{
        
        let target = e.target; // the element that initiated the event
        let value = null; // its value
        let name = target.name; // its name

        if(target.type === 'checkbox'){
            value = target.checked
        }else if(target.type === 'select-multiple'){
            value = [];
            for(let i = 0; i < target.options.length; i++){
                if(target.options[i].selected){
                    value.push(target.options[i].value);
                }
            }
        }
        else{
            value = target.value
        }

        let newUserData = {...userData}; // preform a "shallow" clone of userData        
        newUserData[name] = value; // update the associated property for the control
        setUserData(newUserData); // set the new user data

    }

    if(!userData){
        return null;
    }else{
        return (
            <form onSubmit={handleSubmit}>
                <label>
                Full Name:
                <input type="text" name="fullName" value={userData.fullName} onChange={handleChange} />
                </label><br />
                <label>Full Program Name:
                    <textarea name="programName" value={userData.programName} onChange={handleChange}></textarea>
                </label><br />
                <label>
                Campus:
                <select name="campus" value={userData.campus} onChange={handleChange}>
                <option value="">- Select -</option>
                <option value="king">King</option>
                <option value="markham">Markham</option>
                <option value="newnham">Newnham</option>
                <option value="downtown">Downtown</option>
                </select>
            </label><br />
            <label>Enrolled: <input name="enrolled" type="checkbox" checked={userData.enrolled} onChange={handleChange}></input></label><br />
            <label>Housing:</label><br />
            <label>
                Residence <input name="housing" type="radio" checked={userData.housing === "residence"} value="residence" onChange={handleChange} />
            </label>
            <label>
                Off Campus <input name="housing" type="radio" checked={userData.housing === "off campus"} value="off campus" onChange={handleChange} />
            </label>
            <br />
                <button type="submit">Submit</button>
            
            </form>
            );
    }

}

export default UserDataForm