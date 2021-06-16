import {observer} from 'mobx-react'
import React, {Component} from 'react'
import StudentDetail from '../StudentDetail'
import Students from '../../../../collections/students'
import Assignments from '../../../../collections/assignments'
import StudentProgress from '../Assignments/Progress/models/progress'

import './style.less'

const strings = {
    no_data: `Once students have signed up to BitesMedia, they will automatically show up here.`
}

export default observer(class TeachersPortal extends Component {
    constructor(props, context) {
        super(props, context)

        this.students = new Students()
        this.assignments = new Assignments()

        this.state = {
            activeStudent: undefined,
            activeArticleIds: {},
            completedArticleIds: {},
            loading: false
        }
    }

    componentDidMount() {
        this.students.fetch()
            .then(() => {
                const student = this.students.first()
                if (student) {
                    student.active = true
                    this.setState({
                        activeStudent: student
                    })
                }

                this.assignments.fetch()
                    .then(() => {
                        this.assignments.map(m => {
                            this.students.map(s => {
                                const studentProgress = new StudentProgress()
                                studentProgress.id = s.id
                                studentProgress.fetch({
                                    params: {articleId: m.articleId}
                                }).then(() => {
                                    const progress = studentProgress.progress.get(m.articleId);
                                    if (progress) {
                                        let quizCompletion = progress.quizCompletion && parseInt(progress.quizCompletion.completion);
                                        if (quizCompletion) {
                                            const completedArticleIds = this.state.completedArticleIds;
                                            completedArticleIds[s.studentId] = completedArticleIds[s.studentId] || {};
                                            completedArticleIds[s.studentId][m.articleId] = quizCompletion;
                                            this.setState({completedArticleIds})
                                        }

                                        if (progress.readPercent) {
                                            const activeArticleIds = this.state.activeArticleIds
                                            activeArticleIds[s.studentId] = activeArticleIds[s.studentId] || {};
                                            activeArticleIds[s.studentId][m.articleId] = progress.readPercent;
                                            this.setState({activeArticleIds})
                                        }
                                    }
                                })
                            })
                        })
                    })
            })
    }

    handleTotalActive = id => {
        let totalCount = 0
        const {activeArticleIds} = this.state;
        this.assignments.map((assignment) => {
            if (activeArticleIds[id] && activeArticleIds[id][assignment.articleId]) {
                totalCount++;
            }
        })
        return totalCount
    };

    handleCompletedArticleCount = id => {
        let completedCount = 0
        const {completedArticleIds} = this.state;
        this.assignments.map((assignment) => {
            if (completedArticleIds[id] && completedArticleIds[id][assignment.articleId]) {
                completedCount++
            }
        });
        return completedCount
    };

    render() {
        const {completedArticleIds, activeStudent} = this.state
        if (this.students.size > 0) {
            return (
                <div className={`flex`}>
                    <div className={'my-class'}>
                        <div className="class-title">
                            <p>My Class</p>
                            <p>Completed / Active</p>
                        </div>
                        {this.students.map((student, index) => {
                            return (
                                <div key={student.studentId}
                                     className={student.active ? "class-member member-active" : "class-member"}
                                     onClick={() => {
                                         this.students.models.forEach((student) => student.active = false)

                                         student.active = true
                                         this.setState({
                                             activeStudent: student
                                         })
                                     }}>
                                    {student.notification ?
                                        <div className={student.active ? "member-state state-active" : "member-state"}>
                                            <div className={"member-state-number"}>{student.notification}</div>
                                        </div> : null
                                    }
                                    <p className="member-name">{student.studentName}</p>
                                    <p className="member-ac">{this.handleCompletedArticleCount(student.studentId)} / {this.handleTotalActive(student.studentId)}</p>
                                </div>
                            )
                        })}
                    </div>

                    {activeStudent &&
                    <StudentDetail student={activeStudent} completedArticleIds={completedArticleIds}/>
                    }
                </div>
            )
        } else {
            return (
                <div className={`flex`} style={{flexDirection: 'column'}}>
                    <h2 className={`center`}>Teacher's Portal</h2>
                    <p className="message">Once students sign up, you will see them here.</p>
                </div>
            )
        }
    }
})
