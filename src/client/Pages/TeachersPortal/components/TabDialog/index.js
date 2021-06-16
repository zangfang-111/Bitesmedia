import PieChart from './piechart'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import CheckPanel from './check_panel'
import React, { Component } from 'react'
import API from '../../../../adapters/API'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import DialogContent from '@material-ui/core/DialogContent'
import FormSubmitions from '../../../../collections/formSubmitions'
import { HEADER_KEYS, BLOCK_TYPES } from '../../../../constants/types'

import './style.less'
import 'react-tabs/style/react-tabs.css'

export default observer(class TabDialog extends Component {
  static propTypes = {
    assignment: PropTypes.object
  }
  constructor(props, context) {
    super(props, context)
    this.formSubmitions = new FormSubmitions()
    this.state = {
      open: props.open || false,
      activeFormsubmition: undefined,
      loadflag: true,
      tableHeader: [],
      pieChartData: [],
      articleTrackingData: []
    }
    this.submition_num = 0
    this.question_num = 0
    this.correct_num = 0
    this.comment_text = "Assessment has not yet been completed."
    this.checkpanelResults = []
  }

  componentDidMount() {
    this.articleTrackingDataFetch()

    let studentId = this.props.student.studentId
    let articleId = this.props.articleId

    this.formSubmitions.fetch({
      params: {
        q: {
          user_id: studentId,
          articleId: articleId
        },
        sort: 'timestamp',
        order: "DESC",
        limit: 1
      }
    })
      .then(() => {
        this.formSubmitions.map((formsubmitions) => {
          this.submition_num++
          this.comment_text = ""
          this.setState({
            activeFormsubmition: formsubmitions
          })
        })
      })
  }

  articleTrackingDataFetch() {
    const api = new API()
    let path = '/api/v1/articleTracking'

    let studentId = this.props.student.studentId
    let articleId = this.props.articleId

    return this.loading = api.makeRequest({
      method: "get",
      path,
      params: {
        studentId,
        articleId
      }
    })
      .then((response) => {
        this.handleChartData(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  handleChartData = store => {
    const results = store.map((result) => {
      return {
        block_type: BLOCK_TYPES[result.block_type] || result.block_type,
        sum_seconds: result.sum_seconds
      }
    })

    this.setState({
      pieChartData: results,
      tableHeader: Object.keys(results[0]).map((result) => HEADER_KEYS[result] || result)
    })
  }

  handleClickOpen = () => {
    this.setState({open: true})
  }

  handleClose = () => {
    this.setState({open: false})
    this.props.onSave()
  }

  onCheck(result) {
    this.checkpanelResults.push(result)
    this.state.activeFormsubmition["answer_" + result[1] + "_correct"] = result[0]
    if (result[0]) {
      this.correct_num++
    }

    this.setState({
      loadflag: !this.state.loadflag
    });

    this.handleCheckResults();
  }

  display = () => {
    if (this.state.activeFormsubmition !== undefined) {
      var index = 1
      var return_str = []
      this.question_num = 0
      this.correct_num = 0
      for (var i = 0; i < Object.keys(this.state.activeFormsubmition).length; i++) {
        var q_key = "question_" + index
        var a_key = "answer_" + index
        var c_key = a_key + "_correct"
        if (this.state.activeFormsubmition[q_key] !== "" && this.state.activeFormsubmition[q_key] !== undefined) {
          this.question_num++

          if (this.state.activeFormsubmition[c_key] === true) {
            this.correct_num++
          }

          return_str.push(
            <div key={`${q_key}`}>
              <div className="question">
                <div className="q_text"> {index}. {this.state.activeFormsubmition[q_key]}</div>
                {this.state.activeFormsubmition[a_key] !== "" &&
                  <CheckPanel
                    status={this.state.activeFormsubmition[c_key]}
                    _index={index}
                    onCheck={(result) => this.onCheck(result)}
                    studentId = { this.props.student.studentId }
                    articleId = { this.props.articleId }
                  />
                }
              </div>
              <div className="answer">
                {this.state.activeFormsubmition[a_key] === "" ? "No Answer" : this.state.activeFormsubmition[a_key]}
              </div>
            </div>
          )
          index++
        }
      }
      return return_str
    }
  }

  showEvaluation = () => {
    let getCheckResults = JSON.parse(localStorage.getItem('checkResults'))
    let correctNum = this.correct_num

    if (this.submition_num != 0) {
      if (getCheckResults) {
        getCheckResults.map(item => {
          if (item.articleId == this.props.articleId) {
            correctNum = item.correct_num
          }
        })
      }
      return (
        <div>
          <div className="evaluation">
            <label className="correctNum_label">
              {correctNum} /&nbsp;
            </label>
            {this.question_num}
          </div>
          {/*<button className="saveBtn" onClick={this.handleCheckResults}>Save</button>*/}
        </div>
      )
    }
  }

  handlePanelResults = () => {
    let results = {
      studentId: this.props.student.studentId,
      articleId: this.props.articleId,
      results: this.checkpanelResults
    }

    let getItem = JSON.parse(localStorage.getItem('panelResults'))
    let existStatus = false

    if (getItem) {
      for (let i in getItem) {
        if (getItem[i].articleId == results.articleId && getItem[i].studentId == results.studentId) {
          getItem[i].results = results.results
          existStatus = true
          localStorage.setItem('panelResults', JSON.stringify(getItem))
          break
        }
      }
      if(!existStatus) {
        getItem.push(results)
        localStorage.setItem('panelResults', JSON.stringify(getItem))
      }
    } else {
      let panelResults = []
      panelResults.push(results)
      localStorage.setItem('panelResults', JSON.stringify(panelResults))  
    }
  }

  handleCheckResults = () => {
    this.handlePanelResults()

    if (this.submition_num == 0)
      return

    let results = {
      correct_num: this.correct_num,
      articleId: this.props.articleId
    }
    let getItem = JSON.parse(localStorage.getItem('checkResults'))
    let existStatus = false
    if (getItem) {
      for (let i in getItem) {
        if(getItem[i].articleId == results.articleId) {
          getItem[i].correct_num = results.correct_num
          existStatus = true
          localStorage.setItem('checkResults', JSON.stringify(getItem))
          this.props.getCheckResults(getItem)
          break
        }
      }
      if (!existStatus) {
        getItem.push(results)
        localStorage.setItem('checkResults', JSON.stringify(getItem))
        this.props.getCheckResults(getItem)
      }
    } else {
      let checkResults = []
      checkResults.push(results)
      localStorage.setItem('checkResults', JSON.stringify(checkResults))
      this.props.getCheckResults(checkResults)
    }
  }

  render() {
    const { tableHeader, pieChartData } = this.state

    return (
      <Dialog
        className="dialog"
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="lg"
      >
        <DialogTitle id="form-dialog-title">
          <a href={`/articles/${this.props.assignment.articleSlug}`} target={"_blank"}>{this.props.articleName}</a>
          <Button onClick={this.handleClose} color="primary"
            style={{float: 'right', fontSize: '1.25em', marginTop: '-15px'}}>&times;</Button>
        </DialogTitle>
        <DialogContent className="dialog_content">
          <div>
            <Tabs>
              <TabList>
                <Tab>Quiz Answers</Tab>
                <Tab>{pieChartData && pieChartData.length ? `Article Analytics`: null}</Tab>
                <Tab>{pieChartData && pieChartData.length ? `Raw Data`: null}</Tab>
              </TabList>
              <TabPanel>
                {this.display()}
                {this.showEvaluation()}
                <div className="comment">
                  {this.comment_text}
                </div>
              </TabPanel>
              <TabPanel style={{minWidth: 800, maxWidth: '100%'}}>
                <PieChart data={pieChartData}/>
              </TabPanel>
              <TabPanel style={{minWidth: 800, maxWidth: '100%'}}>
                <table>
                  <thead>
                    <tr>
                      {tableHeader.map((item, key) => {
                        return (
                          <th key={key}>{item}</th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {pieChartData.map((item, key) => {
                      return (
                        <tr key={key}>
                          {Object.entries(item).map((item, k) => {
                            return (
                              <td key={k}>{item[1]}</td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </TabPanel>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
})
