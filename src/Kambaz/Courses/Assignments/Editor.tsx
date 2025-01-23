export default function AssignmentEditor() {
    return (
        <div id="wd-assignments-editor">
            <label htmlFor="wd-name">Assignment Name</label>
            <input id="wd-name" value="A1 - ENV + HTML" /><br /><br />
            <textarea id="wd-description" cols={50} rows={7}>
                The assignment is available online Submit a link to the landing page of
                your Web application running on Netlify. The landing page should include 
                the following: Your full name and section Links to each of the lab 
                assignments Link to the Kanbaz application Links to all relevant source
                code repositories The kambaz application should include a link to naviagte
                back to the landing page.
            </textarea>
            <br />
            <br></br>
            <table>
                <tr>
                    <td align="right" valign="middle">
                        <label htmlFor="wd-points">Points</label>
                    </td>
                    <td>
                        <input id="wd-points" value={100} />
                    </td>
                </tr>
                <br></br>
                <tr>
                    <td align="right" valign="middle">
                        <label htmlFor="wd-group">Assignment Group</label>
                    </td>
                    <td>
                    <select id="wd-group">
                        <option value="VAL1" selected>Assignments</option>
                        <option value="VAL2" >Quizes</option>
                    </select>
                    </td>
                </tr>
                <br></br>
                <tr>
                    <td align="right" valign="middle">
                        <label htmlFor="wd-display-grade">Display Grade as</label>
                    </td>
                    <td>
                    <select id="wd-display-grade">
                        <option value="VAL1" selected>Percentage</option>
                        <option value="VAL2" >Point</option>
                    </select>
                    </td>
                </tr>
                <br></br>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-submission-type">Submission Type</label>
                    </td>
                    <td>
                    <select id="wd-submission-type">
                        <option value="VAL1" selected>Online</option>
                        <option value="VAL2" >In person</option>
                    </select>
                    <br />
                    <br></br>
                        <label>Online Entry Options</label> <br/>
                        <input type="checkbox" id="wd-text-entry"/>
                        <label htmlFor="wd-text-entry">Text Entry</label><br />

                        <input type="checkbox" id="wd-website-url"/>
                        <label htmlFor="wd-website-url">Website URL</label><br />

                        <input type="checkbox" id="wd-medila-recordings"/>
                        <label htmlFor="wd-medila-recordings">Media Recordings</label><br />

                        <input type="checkbox" id="wd-student-annotation"/>
                        <label htmlFor="wd-student-annotation">Student Annotation</label><br />

                        <input type="checkbox" id="wd-file-upload"/>
                        <label htmlFor="wd-file-upload">File Uploads</label><br />

                    </td>
                </tr>
                <br></br>
                <tr>
                    <td align="right" valign="top">
                        <label>Assign</label>
                    </td>
                    <td>
                        <label htmlFor="wd-assign-to">Assign to</label><br />
                        <input id="wd-assign-to" value={"Everyone"} /><br />
                        <br></br>
                        <label htmlFor="wd-due-date">Due</label><br />
                        <input id="wd-due-date" type="date" value="2024-05-13" /><br />
                        <br></br>
                        <td>
                            <label htmlFor="wd-available-from">Available from</label><br />
                            <input id="wd-available-from" type="date" value="2024-05-06"  /><br />
                        </td>
                        <td>
                            <label htmlFor="wd-available-until">Until</label><br />
                            <input id="wd-available-until" type="date" value="2024-05-20"  />
                        </td>
                    </td>
                    <br></br>
                </tr>

            </table>
            <hr />
            <table>
                <tr>
                <br></br>
                    <td align="right" valign="bottom">
                        <button>Cancel</button>
                        <button>Save</button>
                    </td>
                </tr>
            </table>
        </div>
    );
}
