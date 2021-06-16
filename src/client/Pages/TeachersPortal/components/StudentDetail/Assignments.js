import { observer } from 'mobx-react'
import TabDialog from '../TabDialog'
import React, { Component } from 'react'
import AssignmentForm from '../Assignments/Form'
import { confirmAlert } from 'react-confirm-alert'
import { DeleteOutlined } from '@material-ui/icons/'
import Assignment from "../../../../models/assignment";
import AssignmentProgress from '../Assignments/Progress'
import Assignments from '../../../../collections/assignments'

import 'react-confirm-alert/src/react-confirm-alert.css'

export default observer(class AssignmentView extends Component {
  constructor(props){
    super(props)

    this.assignments = new Assignments()
    this.assignment = new Assignment()

    this.state = {
      open: false,
      isDialogOpen: false,
      ass_key: "",
      ass_name:"",
      studentId: props.student.id,
      isDeleteModalOpen: false,
      loading: false
    }
    this.checkResults = []
  }

  componentWillReceiveProps(props) {
    const {state} = this

    if(state.studentId !== props.student.id) {
      this.fetchStudentAssignments()

      this.setState({
        studentId: props.student.id
      })
    }
  }

  componentDidMount() {
    this.fetchStudentAssignments()
    this.reload()
  }

  reload = () => {
    setTimeout(() => {
      this.setState({ loading: !this.state.loading })
    }, 2000);
  }

  getCheckResults = results => {
    this.checkResults = results && results
  }

  fetchStudentAssignments() {
    this.assignments.fetch();
  }

  handleAddClick = () => {
    this.setState({
      open: !this.state.open
    })
  }

  handleAssignment = assignment => {
    this.setState({
      isDialogOpen: !this.state.isDialogOpen,
      ass_key: assignment.articleId,
      ass_name: assignment.name,
      assignment: assignment
    })
  }

  handleCheckResultCount = id => {
    let results = JSON.parse(localStorage.getItem('checkResults'))
    let correctNum = 0
    let status = false
    if ( results && results.length > 0) {
      for (let i in results) {
        if (results[i].articleId == id) {
          correctNum = results[i].correct_num
          status = true
          break
        }
        if(!status)
          correctNum = 0
      }
      return correctNum
    } else {
      return correctNum = 0
    }
  }

  handleDeleteAssignment = assignmentId => {
    const data = {
      visible: false
    }
    this.assignments.updateModel({ data }, assignmentId)
      .then((response) => {
        this.assignments.models.delete(assignmentId);
      })
      .catch((error) => {
        this.setState({
          error: /401/.test(error.message) ? "You don't have permissions to do that.": error.message
        });
      });
  }

  confirmSubmit = assignmentId => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Confirm</h1>
            <p>This will remove this assignment.</p>
            <button onClick={onClose}>No</button>
            <button onClick={() => {
              this.handleDeleteAssignment(assignmentId)
              this.setState({ loading: !this.state.loading })
              onClose()
            }}>Yes, Delete it!</button>
          </div>
        )
      }
    })
  }

  render() {
    const { completedArticleIds, student } = this.props
    const { open, isDialogOpen, ass_key, ass_name, assignment } = this.state

    return (
      <div>
        <p className="member-body-title">ASSIGNMENTS</p>
        <div>
          { this.assignments.map((assignment, index) => {
            // if (student.studentId == assignment.studentId) {
              return (
                <div key={`ass-${index}`} className="assign-bite">
                  <div className="assign-bite-div" 
                    style={{
                      backgroundImage: `url(${assignment.articleImage})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPositionY: '25%'
                    }}
                  >
                    <div className="delete_icon" onClick={() => this.confirmSubmit(assignment.id)}><DeleteOutlined/></div>
                    <div className="transparent-image-overlay" />
                    <div className="assign-bite-details" onClick={() => { this.handleAssignment(assignment) }}>
                      <p className="assign-bite-title">{assignment.name}</p>
                      <div className="progressbar">
                        <AssignmentProgress
                          student={student}
                          articleId={assignment.articleId}
                          assignment={assignment}
                        />
                        { completedArticleIds[student.studentId] && completedArticleIds[student.studentId][assignment.articleId] &&
                          <p className="correct_count">{this.handleCheckResultCount(assignment.articleId)} / 5</p>
                        }
                      </div>
                      <p>Assigned {assignment.startDate}</p>
                      <p>Due {assignment.endDate}</p>
                      { assignment.individual && <p>For this student only</p> }
                    </div>
                  </div>
                </div>
              )
            // }
          })}
          <div className="assign-new-bite" onClick={this.handleAddClick}>
            <div className="add-bite-icon" >+</div>
            <p className="add-bite-title">Assign a new article</p>
          </div>
          {open && 
            <AssignmentForm
              student={student}
              open={open}
              onSave={(model) => {
                this.setState({ open: false })
                this.assignments.setModel(model)
              }}
            />
          }
          {isDialogOpen &&
            <TabDialog
              open={isDialogOpen}
              student={student}
              articleId={ass_key}
              articleName={ass_name}
              assignment={assignment}
              getCheckResults={this.getCheckResults}
              onSave={() => {
                this.setState({
                  isDialogOpen: false
                })
              }}
            />
          }
        </div>
      </div>
    )
  }
})
