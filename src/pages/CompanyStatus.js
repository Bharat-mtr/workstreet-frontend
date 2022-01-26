import React from 'react'
import Company from '../components/Company'
import UserHeader from '../components/UserHeader'
// import { Rounds } from '../components/RoundStatus'
import Landing4 from '../components/Landing4'
import '../css/CompanyStatus.css'
import { GoogleAuthContext } from '../contexts/GoogleAuthContext'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { config } from '../env'

class CompanyStatus extends React.Component {
    static contextType = GoogleAuthContext
    state = {
        companyDetails: null,
        companyName: ''
    }

    async componentDidMount() {
        if (this.context.appliedFor.length === 0) {
            this.props.history.push('/appliedCompany')
        }
        const { id } = this.props.match.params
        // console.log('Id', id)
        if (!id || id >= this.context.appliedFor.length) {
            this.props.history.push('/appliedCompany')
            return
        }
        // console.log('Context', this.context)
        const res = await axios.post(config.apiDomain + 'company/get/byid', {
            token: localStorage.getItem('token'),
            id: this.context.appliedFor[id].companyId
        })

        this.setState({
            companyDetails: this.context.appliedFor[id],
            companyName: res.data.name
        })
    }

    render() {
        const { companyDetails } = this.state
        // console.log(companyDetails)
        return (
            <div>
                <UserHeader />
                <div className="compStatus-flex">
                    <div className="your-status-line">
                        <div className="your-status-heading">
                            <h3>Track Your Status </h3>
                            <h3>For {this.state.companyName}</h3>
                        </div>
                        <div className="your-status-message">
                            {companyDetails && companyDetails.status === 'Accepted' ? (
                                <>
                                    <p>
                                        Congratulations!! on your Intern-crack🎉🎉. Your efforts
                                        have been recognized.
                                    </p>
                                    <p>If you like us, please tell your friends about us.✨✨</p>
                                </>
                            ) : (
                                <p>
                                    Workstreet appreciates your devotion and dedication,
                                    unfortunately, the skill requirements were higher. Don&apos;t
                                    worry there are many more opportunities to come✌️ which we will
                                    deliver immediately to your mailbox.🙌
                                </p>
                            )}
                        </div>
                    </div>

                    {companyDetails && (
                        <Company
                            id={companyDetails.companyId}
                            status={companyDetails.status}
                            date={companyDetails.round[0].date}
                            track={false}
                        />
                    )}
                </div>
                <div className="compstatus-c2">
                    <div className="compstatus-tracktext">Track Status</div>
                    <hr
                        style={{
                            height: '1px',
                            borderWidth: '0px',
                            backgroundColor: '#071e3d'
                        }}
                    />
                    <div className="roundtstatus-portion">
                        {companyDetails &&
                            companyDetails.round.map((round, index) => (
                                <>
                                    <div
                                        className="icon"
                                        style={{
                                            position: 'relative'
                                        }}
                                    >
                                        <i
                                            className={round.icon}
                                            style={{ color: round.status ? '#ffa45c' : '#bababa' }}
                                        ></i>
                                    </div>
                                    <div className="roundstatus">
                                        <div className="text">
                                            {round.name}
                                            <div style={{ fontSize: '12px', color: '#6e6d76' }}>
                                                {new Date(round.date).toDateString() ===
                                                'Invalid Date'
                                                    ? round.date
                                                    : new Date(round.date).toDateString()}
                                            </div>
                                        </div>
                                        <div className="review">&quot;{round.remark}&quot;</div>
                                    </div>
                                </>
                            ))}
                    </div>
                </div>
                <Landing4 />
            </div>
        )
    }
}

export default withRouter(CompanyStatus)
