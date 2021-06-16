import React, { Component } from 'react'
import { observer } from 'mobx-react'
import './style.less'
import correctImg from "../../img/true.png"
import incorrectImg from "../../img/false.png"

export default observer (class CheckPanel extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      status: this.props.status
    }
  }

  componentDidMount() {
    const { studentId, articleId, _index } = this.props
    let panelResults = JSON.parse(localStorage.getItem('panelResults'))
    if (panelResults) {
      panelResults.map((item) => {
        if (item.studentId == studentId && item.articleId == articleId) {
          for (let i in item.results) {
            if (item.results[i][1] == _index) {
              this.setState({ status: item.results[i][0] })
              break
            }
          }
        }
      })
    }
  }

  check = result => {
    this.setState({
      status:result
    })
    let results = [result, this.props._index]
    this.props.onCheck(results)
  }

  render() {
    const { status, panelResults } = this.state
    return (
      <div className = "check_panel">
        { status === undefined &&
          <div className = "check_panel" id = { "check_panel" + this.props._index }>
            <div className = "btn_true" onClick = {() => this.check(true)} ><img src={correctImg} /></div>
            <div className = "btn_false" onClick = {() => this.check(false)} ><img src={incorrectImg} /></div>
          </div>
        }
        { status === true &&
          <div className = "check_panel" id = { "check_panel"+this.props._index }>
            <div className = "correct_label">Correct</div>
          </div>
        }
        { status === false &&
          <div className = "check_panel" id = { "check_panel"+this.props._index }>
            <div className = "incorrect_label">Incorrect</div>
          </div>
        }
      </div>
    )
  }
})
