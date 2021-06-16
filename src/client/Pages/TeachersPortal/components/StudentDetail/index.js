import React, { Component } from 'react';
import { observer } from 'mobx-react';
import StudentHeader from './StudentHeader';
import Assignments from './Assignments';
import Report from './Report';
import Messages from './Messages';

export default observer(class MemberDetail extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      active: 'assignments',
      student: props.student
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      student: nextProps.student
    });
  }

  render() {
    const { active, student } = this.state;
    return (
      <div className="member-detail">
        <StudentHeader
          student={student}
          active={active}
          setActive={(active) => {
            this.setState({
              active
            });
          }}
        />
        <div className="member-body">
          { active === 'assignments' && 
            <Assignments {...this.props} student={student} completedArticleIds={this.props.completedArticleIds}/>
          }
          { active === 'messages' && 
            <Messages {...this.props} />
          }
          { active === 'report' &&
            <Report {...this.props} />
          }
        </div>
      </div>
    );
  }
})
