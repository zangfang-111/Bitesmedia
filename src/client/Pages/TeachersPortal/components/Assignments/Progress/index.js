import React, { Component } from 'react';
import { observer } from 'mobx-react';
import StudentProgress from './models/progress';
import './style.less';

export default observer(class AssignmentProgress extends Component {
  constructor(props, context) {
    super(props, context);
    this.studentProgress = new StudentProgress();
  }

  componentDidMount() {
    this.fetchStudentProgress(this.props.student && this.props.student.id, this.props.articleId)
  }

  fetchStudentProgress(studentId, articleId) {
    this.studentProgress.id = studentId;
    this.studentProgress.fetch({
      params: {
        articleId
      }
    })
      .then(() => {
        const progress = this.studentProgress.progress.get(this.props.articleId);
        this.props.assignment.progress = progress && progress.readPercent;
      });
  }

  componentWillReceiveProps(nextProps, context) {
    this.studentProgress = new StudentProgress();
    this.fetchStudentProgress(nextProps.student && nextProps.student.id, nextProps.articleId);
  }

  render() {
    const { studentProgress } = this;
    const progress = studentProgress.progress.get(this.props.articleId);

    if(!progress) {
      return (
        <div>
          <div className="assignment_not">Assignment not yet started</div>
          <div className="assign-progress">
            <div className="real-progress" style={{ width: 0 }} />
          </div>
        </div>
      )
    }

    let quizCompletion = progress.quizCompletion && parseInt(progress.quizCompletion.completion) || 0;
    let isCompleted = quizCompletion === 100;

    return (
      <div className="tp-progress">
        <span className="read-progress">
          {progress.readPercent || 0}% Read
        </span>
        { isCompleted
          ? <span className = "quiz-progress complete">{`Quiz Complete`}</span>
          : ( quizCompletion > 0
            ? <span className = "quiz-progress partially-complete">{`${quizCompletion}% quiz completion`}</span>
            : <span className = "quiz-progress not-started">Quiz Not Started</span> )
        }
        <div className="assign-progress">
          <div className="real-progress" style={{ width: `${quizCompletion}%` }} />
        </div>
      </div>
    );
  }
})
