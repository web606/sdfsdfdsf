
import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { fetchJson } from 'src/utils/fetch';
import { SERVICE as API} from 'src/utils/api';
import { Tab, Modal, Loading, Button } from 'dragon-mobile-ui';
import StaticToast from 'src/components/common/Toast';
import dia from 'src/utils/dia';
import Filter from '../Filter';
import FUNC from 'src/utils/func';
import ReactDOM from 'react-dom';
import './order.scss';

function InnerHead({ list }) {
    return (
        <div className="order-list">
            <div className="none-data">
                <img src={require('../images/no_record.png')}></img>
                <p className="none-tip">您没有相应的订单哦！</p>
            </div>
        </div>
    )
}

class InnerBody extends Component {
	state = {
		showInfo: false,
		statesView: true
	}

	
	delOrder(item) { 
		
		let date = this.props.title;
		let _this = this;
		fetchJson({
			type:"POST",
			url:API.POST_Del_List,
			data: {
				insAppId: item,
			},
			success: (res) => {
				if (res.isDeleteSuceess) {
					this.setState((state, props) => {
						return { 
							showInfo: !state.showInfo
						}
					}, () => { 
						StaticToast.confirmCopy("删除成功")
					})
					
					_this.props.deleteList(item, date);
					

				} else { 
					StaticToast.confirmCopy("删除失败")
				}
			}
		});
	}

	// 跳转支付页面
	goPayment(item) { 
		
		let storageObj = localStorage[`${item.productId}${item.accountId}`]
			? JSON.parse(localStorage[`${item.productId}${item.accountId}`])
			: {}
		storageObj['insAppId'] = item.insAppId;
		localStorage[`${item.productId}${item.accountId}`] = JSON.stringify(storageObj);

		FUNC.hrefTo('/product/payment?insAppId=' + (item.insAppId||'') +
		'&bankCode=' + (item.bankCode || '') +
		'&phoneNumInput=' + (item.reservedTel || '') + //字段变更simon：reservedTel
		'&premium=' + (item.prem || '') +
		'&bankAccCode=' + (item.bankAccNo || '') +
		'&bankAccName=' + (item.bankAccName || '') +
		'&productId=' + (item.productId || '')
	);
	}

	// 跳转静态告知页面
	resp(item){
		
		let storageObj = localStorage[`${item.productId}${item.accountId}`]
			? JSON.parse(localStorage[`${item.productId}${item.accountId}`])
			: {}
		storageObj['insAppId'] = item.insAppId;
		localStorage[`${item.productId}${item.accountId}`] = JSON.stringify(storageObj);
		localStorage.setItem("planId", item.planId);
		FUNC.hrefToHard(`/product/notice?id=${item.productId}&planId=${item.planId}`);
	}
	hangInput = () => { 
	
		this.setState((state, props) => {
			return { 
				showInfo: !state.showInfo
		 }})
		
		
	}
	expend() { 
		this.setState({
			statesView: !this.state.statesView,
		})
	} 
	leave = () => { 
		this.setState((state, props) => {
			return { 
				showInfo: !state.showInfo
		 }})
}
	
	
	render() {
	
		let { item, titleName } = this.props;
		const { statesView, datial } = this.state;
		if (!item) { 
			return null;
		}
		return(
			<div className="order-list">
				<div className={`order-item ${statesView ? '' : "expend"}`} >
					<div className="order-item-title">
						<div><p>{item.proposalContNo}</p></div>
						<div>
							<span className="order-state">{item.stateName}</span>
							{/* <span className="menu-icon" style={{display: menuIcon}} onClick={()=>this.props.receipt(item.proposalContNo)}></span> */}
						</div>
					</div>
					<div className="order-item-content" >
						<div className={(item.receiptFailReasons) ? 'fail-reason' : 'none'}>{item.receiptFailReasons}</div>
						<div className="order-item-summary">
							<div><span>{item.appntName}</span> / <span>{item.insuredName}</span></div>
							<div>&yen;<span>{item.prem}保费</span></div>
						</div>
						<div className="order-item-switch"><p>{item.mainRiskName}</p></div>
					</div>
				
					<div className="order-item-content-detail">
						<div className="detail-item">
							<div className="label">主险名称</div>
							<div className="value"><p>{item.mainRiskName}</p></div>
						</div>
						<div className="detail-item">
							<div className="label">产品代码</div>
							<div className="value"><p>{item.mainRiskCode}</p></div>
						</div>
						<div className="detail-item">
							<div className="label">投保人/被保人</div>
							<div className="value"><p>{item.appntName}/{item.insuredName}</p></div>
						</div>
						<div className="detail-item">
							<div className="label">保费</div>
							<div className="value"><p>&yen;{item.prem}</p></div>
						</div>
						<div className="detail-item">
							<div className="label">缴费年期</div>
							<div className="value"><p>{item.payYears}</p></div>
						</div>
						<div className="detail-item">
							<div className="label">投保日期</div>
							<div className="value"><p>{item.applyDate}</p></div>
						</div>
						<div className="detail-item">
							<div className="label">承保日期</div>
							<div className="value"><p>{item.signDate}</p></div>
						</div>
						<div className="detail-item">
							<div className="label">客户回执日期</div>
							<div className="value"><p>{item.customGetPolDate}</p></div>
						</div>
						<div className="detail-item">
							<div className="label">投保单号</div>
							<div className="value"><p>{item.proposalContNo}</p></div>
						</div>
						<div className="detail-item">
							<div className="label">保单编号</div>
							<div className="value"><p>{item.contNo}</p></div>
						</div>
					</div>

					<div className='order-item-content-opener'>
						<div
							className="order_more_menu1"
							style={{ display: statesView ? "none" : '' }}
							onClick={() => this.expend()} >

							<span className="text">收起</span>
							<span className="switch-arrow"></span>
						</div>

						<ul className="order-menu-item" style={{ display: statesView ? "" : "none" }}>
							<li>
								<div className="order_more_menu2" onClick={() => this.expend()} >
									<span className="text switch-menu-arrow">更多详情</span>
								</div>
							</li>
			
							<li>
								<div className="order_menu_expend"
									onClick={this.hangInput}
									style={{display:item.stateName=="录入中"?"":"none"}}>
									删除
								</div>
								<div className="order_menu_expend"
									onClick={(e) => { this.resp(item) }}
									style={{display:item.stateName=="录入中"?"":"none"}}>
									编辑
								</div>
								<div className="order_menu_expend"
									onClick={(e) => { this.goPayment(item) }}
									style={{display:item.stateName=="未支付"?"":"none"}}>
									重新支付
								</div>
							</li>
						</ul>
				</div>

				</div>
				
				<Modal  visible={this.state.showInfo}>
					{/* <Modal.Header title="请详述你的健康告知" ></Modal.Header> */}
					<Modal.Body>
						<div style={{paddingTop: '1rem', textAlign: 'center'}}>你确定要删除吗</div>
					</Modal.Body>
					<Modal.Footer>
						<Button radius block bordered size="sm" className="normal-btn" onClick={ this.leave}>取消</Button>
						<Button radius block bordered size="sm" className="color-btn blue" onClick={(itme) => { this.delOrder(item.insAppId) }}>确定</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

function Inner({ list, title ,deleteList}) {
	
	if (list && list.length > 0) {
		return (
            <div >
                { list.map((item, i) => {
                        return (
							<InnerBody
								item={item}
								key={i}
								title={title}
								deleteList={deleteList}/>
                        )
                    }) }
            </div >
          
        )
       
	} 
	return <InnerHead item={list} />
}


class Order extends Component{
	constructor(props){
		super(props);
		this.state = {
			showFilter: false,
			planList: [],
			showReceipt: false,
			commitReceiptState: false,
			acknowledgeImg: "",
		};
		this.getOrderList = this.getOrderList.bind(this);
	}

	componentDidMount(){

		//给当前组件绑定弹窗控制函数
		dia(this);
		this.getOrderList();

	}

	getOrderList(){
		fetchJson({
			type:"POST",
			url:API.ORDER_LIST,
			data: {
				accountId: localStorage.accountId
			},
			success:(res)=>{
				this.setData(res);
				this.getPlanList();
				/*this.setState({
				 planList: [{key:1,value:'健康险01'},{key:2,value:'健康险02'},{key:3,value:'健康险03'}]
				 });	*/
			}
		});
	}

	getPlanList(){
		fetchJson({
			type:"POST",
			url:API.POST_PRODUCT_LIST,
			data:{},
			success:(res)=>{
				this.setState({
					planList: res
				});
			}
		});
	}

	setData(orderList){
		let data = {};
		data.orderList = orderList || [];
		data.status01 = [];  //录入中
		data.status02 = [];  //未支付
		data.status03 = [];  //已完成
		data.status04 = [];  //人核中
		data.status05 = [];  //失败件
		

		data.orderList.map((item) => {

			if([0, 1, 2, 4, 5].find((ele)=>{return item.stateCode == ele}) != undefined){
				item.stateName = "录入中";
				data.status01.push(item);
			}
			if ([8].find((ele)=>{return item.stateCode == ele}) != undefined){
				item.stateName = "未支付";
				data.status02.push(item);
			}

			if([9, 14, 15, 16].find((ele)=>{return item.stateCode == ele}) != undefined){
				item.stateName = "已完成";
				data.status03.push(item);
			}

			if ([13].find((ele)=>{return item.stateCode == ele}) != undefined){
				item.stateName = "人核中";
				data.status04.push(item);
			}

			if ([3, 6, 7, 10, 11, 12].find((ele)=>{return item.stateCode == ele}) != undefined){
				item.stateName = "失败件";
				data.status05.push(item);
			}

		
		});

		this.setState(data);
	}

	filter(data){
		this.setState({
			orderList : []
		});

		fetchJson({
			type:"POST",
			url:API.ORDER_LIST,
			data:data,
			success:(res)=>{
				this.setData(res);
			}
		});
	}

	commitReceipt(e, callback) {
		
		let _this = this;
		let {files}=e.target;
		this.setState({loading:true});
		if (!/image\/\w+/.test(files[0].type)) {
			StaticToast.error("只能选择图片哦");
			return false;
		}
		var reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload = function (e) {
			_this.state.acknowledgeImg = this.result;
			_this.upLoading(_this.state.acknowledgeImg,callback);
		};
		reader.onerror=function(){
			StaticToast.error("上传出错，请重新上传");
			_this.setState({loading:false,commitReceiptState:false});
			return false;
		};
	}
	upLoading(result,callback){
		let acknowledgeImg = this.state.acknowledgeImg;
		let applyCode = this.state.applyCode;

		const item = this.state.orderList.find((item)=>{
			return item.proposalContNo == applyCode;
		});


		let sellType = '';
		let contNo = '';

		if(item){
			sellType = item.sellType || '';
			contNo = item.contNo || '';
		}


		fetchJson({
			type: "POST",
			url: API.POST_ACKNOWLEDGE,
			data: {

				acknowledgeImg : acknowledgeImg,
				applyCode : applyCode,
				sellType : sellType,
				contNo : contNo
			},
			success:(res)=>{
				this.setState({acknowledgeImg:"",commitReceiptState:true,loading:false});
				callback&&callback(res);
			},error:(res)=>{
				let errorMsg = res.resultMsg;
				if(errorMsg && errorMsg.indexOf('java') >= 0){
					errorMsg = '网络异常！';
				}

				if(errorMsg){
					StaticToast.error(errorMsg);
				}

				this.setState({acknowledgeImg:"", commitReceiptState:false});
			}
		});
	}

	deleteList = (v, k) => {  // 删除选中的订单

		let targetElement
		if (k === "all") {
			targetElement = this.state.orderList;
		} else if (k === "writeing") { 
			targetElement = this.state.status01;
		}
		
		targetElement.forEach(function(value,key) {
			if (v == value.insAppId) { 
				targetElement.splice(key,1);
			}
		});
		this.setState({
			status01: targetElement,
		})
	}

	handleSuccess(){
		if (this.state.commitReceiptState) {
			this.setState({showReceipt: false});
			this.getOrderList();
		} else {
			StaticToast.error("请拍摄或上传回执影像");
		}
	}
	receipt(e){
		this.setState({applyCode: e, showReceipt:true});
	}

	render() {
		const { orderList } = this.state;
		if(this.state.showReceipt){
			return (<Receipt title="保单回执影像" commitReceipt={this.commitReceipt.bind(this)} handleSuccess={this.handleSuccess.bind(this)}></Receipt>)
		}
		if (!orderList) { 
			return null
		}
		return (
			<div className="order-list-box">
				{/* <div className="order-title"><div className="filter" onClick={()=>this.open('showFilter')}></div></div> */}

				<div className="btn-filter" onClick={() => this.open('showFilter')}>
					<span className="icon icon-filter"></span><span>筛选</span>
				</div>

				<div>
					<Tab.Group theme="info" onChange={this.getOrderList}>

						<Tab title="全部" >
							<Inner list={this.state.orderList} title="all" deleteList={this.deleteList} />
						</Tab>

						<Tab title="录入中">
							<Inner list={this.state.status01} title="writeing" deleteList={this.deleteList}></Inner>
						</Tab>

						<Tab title="未支付">
							<Inner list={this.state.status02}></Inner>
						</Tab>

						<Tab title="已完成">
							<Inner list={this.state.status03}></Inner>
						</Tab>

						<Tab title="人核中">
							<Inner list={this.state.status04}></Inner>
						</Tab>

						<Tab title="失败件">
							<Inner list={this.state.status05}></Inner>
						</Tab>
					</Tab.Group>

				</div>

				<Filter
					showFilter={this.state.showFilter}
					planList={this.state.planList}
					close={(() => { this.close('showFilter') }).bind(this)}
					forComp='productId'
					filter={this.filter.bind(this)}
					titleName='订单筛选'>
				</Filter>

				<Loading visible={this.state.loading} />
			</div>
		)
	}
}

export default  Order;
