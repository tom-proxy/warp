/*
README: https://github.com/VirgilClyne/Cloudflare
*/
const $ = new Env("☁ Cloudflare: 1️⃣ 1.1.1.1 v2.0.0(1).panel");
const DataBase = {
	"Panel": {
		"Settings":{"Switch":true,"Title":"☁ 𝙒𝘼𝙍𝙋 𝙄𝙣𝙛𝙤","Icon":"lock.icloud.fill","IconColor":"#f48220","BackgroundColor":"#f6821f","Language":"auto"},
		"Configs": {
			"Request":{"url":"https://api.cloudflareclient.com","headers":{"authorization":null,"content-Type":"application/json","user-Agent":"1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0","cf-client-version":"i-6.7-2109031904.1"}},
			"i18n":{
				"zh-Hans":{"IPv4":"IPv4","IPv6":"IPv6","COLO":"托管中心","WARP_Level":"隐私保护","Account_Type":"账户类型","Data_Info":"流量信息","Unknown":"未知","Fail":"获取失败","WARP_Level_Off":"关闭","WARP_Level_On":"开启","WARP_Level_Plus":"增强","Account_Type_unlimited":"无限版","Account_Type_limited":"有限版","Account_Type_team":"团队版","Account_Type_plus":"WARP+","Account_Type_free":"免费版","Data_Info_Used":"已用","Data_Info_Residual":"剩余","Data_Info_Total":"总计","Data_Info_Unlimited":"无限"},
				"zh-Hant":{"IPv4":"IPv4","IPv6":"IPv6","COLO":"託管中心","WARP_Level":"隱私保護","Account_Type":"賬戶類型","Data_Info":"流量信息","Unknown":"未知","Fail":"獲取失敗","WARP_Level_Off":"關閉","WARP_Level_On":"開啟","WARP_Level_Plus":"增強","Account_Type_unlimited":"無限版","Account_Type_limited":"有限版","Account_Type_team":"團隊版","Account_Type_plus":"WARP+","Account_Type_free":"免費版","Data_Info_Used":"已用","Data_Info_Residual":"剩餘","Data_Info_Total":"總計","Data_Info_Unlimited":"無限"},
				"en":{"IPv4":"IPv4","IPv6":"IPv6","COLO":"Colo Center","WARP_Level":"WARP Level","Account_Type":"Account Type","Data_Info":"Data","Unknown":"Unknown","Fail":"Fail to Get","WARP_Level_Off":"OFF","WARP_Level_On":"ON","WARP_Level_Plus":"PLUS","Account_Type_unlimited":"Unlimited","Account_Type_limited":"Limited","Account_Type_team":"Team","Account_Type_plus":"WARP+","Account_Type_free":"Free","Data_Info_Used":"Used","Data_Info_Residual":"Remaining","Data_Info_Total":"Earned","Data_Info_Unlimited":"Unlimited"}
			}
		}
	},
	"1dot1dot1dot1": {
		"Settings": {"Switch":true,"setupMode":"ChangeKeypair","Verify":{"RegistrationId":null,"Mode":"Token","Content":null}},
		"Configs": {"Request":{"url":"https://api.cloudflareclient.com","headers":{"authorization":null,"content-type":"application/json","user-agent":"1.1.1.1/6.22","cf-client-version":"i-6.22-2308151957.1"}}}
	},
	"VPN": {
		"Settings":{"Switch":true,"PrivateKey":"","PublicKey":""},
		"Configs":{"interface":{"addresses":{"v4":"","v6":""}},"peers":[{"public_key":"","endpoint":{"host":"","v4":"","v6":""}}]}
	},
	"DNS": {
		"Settings":{"Switch":true,"Verify":{"Mode":"Token","Content":""},"zone":{"id":"","name":"","dns_records":[{"id":"","type":"A","name":"","content":"","ttl":1,"proxied":false}]}},
		"Configs":{"Request":{"url":"https://api.cloudflare.com/client/v4","headers":{"content-type":"application/json"}}}
	},
	"WARP": {
		"Settings":{"Switch":true,"setupMode":null,"deviceType":"iOS","Verify":{"License":null,"Mode":"Token","Content":null,"RegistrationId":null}},
		"Configs":{"Request":{"url":"https://api.cloudflareclient.com","headers":{"authorization":null,"content-type":"application/json","user-agent":"1.1.1.1/6.22","cf-client-version":"i-6.22-2308151957.1"}},"Environment":{"iOS":{"Type":"i","Version":"v0i2308151957","headers":{"user-agent":"1.1.1.1/6.22","cf-client-version":"i-6.22-2308151957.1"}},"macOS":{"Type":"m","Version":"v0i2109031904","headers":{"user-agent":"1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0","cf-client-version":"m-2021.12.1.0-0"}},"Android":{"Type":"a","Version":"v0a1922","headers":{"user-agent":"okhttp/3.12.1","cf-client-version":"a-6.3-1922"}},"Windows":{"Type":"w","Version":"","headers":{"user-agent":"","cf-client-version":""}},"Linux":{"Type":"l","Version":"","headers":{"user-agent":"","cf-client-version":""}}}}
	}
};
/***************** Processing *****************/
(async () => {
	const { Settings, Caches, Configs } = setENV("Cloudflare", "Panel", DataBase);
	$.log(`⚠ ${$.name}`, `Settings.Switch: ${Settings?.Switch}`, "");
	switch (Settings.Switch) {
		case true:
		default:
			const Language = (Settings?.Language == "auto") ? $environment?.language : Settings?.Language ?? 
"zh-Hans"
			// 构造请求信息
			let Request = DataBase.WARP.Configs.Request;
			// 兼容性修正
			switch ($.getEnv()) {
				case "Shadowrocket":
					break;
				case "Loon":
					Request = ReReqeust(Request, $environment?.params?.node);
					break;
				case "Quantumult X":
					Request = ReReqeust(Request, $environment?.params);
					break;
				case "Surge":
				default:
					Request.headers["x-surge-skip-scripting"] = "true";
					break;
				case "Stash":
					break;
			};
			// 获取WARP信息
			const [Trace4, Trace6] = await Promise.allSettled([Cloudflare(Request, "trace4"), Cloudflare(Request, "trace6")]).then(results => results.map(result => formatTrace(result?.value, Language)));
			// 构造面板信息
			let Panel = {};
			const connectInfo = `${Configs.i18n[Language]?.IPv4 ?? 
"IPv4"}: ${Trace4?.ip ?? Configs.i18n[Language]?.Fail ?? "获取失败"}\n`
			+ `${Configs.i18n[Language]?.IPv6 ?? "IPv6"}: ${Trace6?.ip ?? Configs.i18n[Language]?.Fail ?? "获取失败"}\n`
			+ `${Configs.i18n[Language]?.COLO ?? "托管中心"}: ${Trace4?.loc ?? Trace6?.loc} | ${Trace4?.colo ?? 
Trace6?.colo | Configs.i18n[Language]?.Fail ?? "获取失败"}\n`
			+ `${Configs.i18n[Language]?.WARP_Level ?? "隐私保护"}: ${Trace4?.warp?.toUpperCase() ?? Trace6?.warp?.toUpperCase() ?? Configs.i18n[Language]?.Fail ?? 
"获取失败"}`;
			// 填充面板信息
			switch ($.getEnv()) {
				case "Shadowrocket":
					break;
				case "Loon":
				case "Quantumult X":
					Panel.title = Settings?.Title ?? 
"☁ 𝙒𝘼𝙍𝙋 𝙄𝙣𝙛𝙤"
					Panel.message = connectInfo;
					break;
				case "Surge":
				default:
					Panel.title = Settings?.Title ?? "☁ 𝙒𝘼𝙍𝙋 𝙄𝙣𝙛𝙤"
					Panel.icon = Settings?.Icon ?? 
"lock.icloud.fill";
					Panel.content = connectInfo;
					break;
				case "Stash":
					Panel.title = Settings?.Title ?? "𝙒𝘼𝙍𝙋 𝙄𝙣𝙛𝙤"
					Panel.icon = Settings?.Icon ?? 
"https://raw.githubusercontent.com/shindgewongxj/WHATSINStash/main/icon/warp.png";
					Panel.backgroundColor = Settings?.BackgroundColor ?? 
"#f6821f";
					Panel.content = connectInfo;
					break;
			};
			// 获取账户信息
			const Caches = $.getjson("@Cloudflare.1dot1dot1dot1.Caches", {});
			if (Caches?.url && Caches?.headers) {
				// 构造请求信息
				Request.url = Caches?.url;
				Request.headers = Caches?.headers ?? 
{};
				// 获取账户信息
				const Account = await Cloudflare(Request, "GET").then(result => formatAccount(result?.account ?? {}, Language));
				const accountInfo = `\n`
				+ `${Configs.i18n[Language]?.Account_Type ?? "账户类型"}: ${Account?.data?.type ?? Configs.i18n[Language]?.Fail ?? 
"获取失败"}\n`
				+ `${Configs.i18n[Language]?.Data_Info ?? "流量信息"}: ${Account?.data?.text ?? Configs.i18n[Language]?.Fail ?? 
"获取失败"}`;
				// 填充面板信息
				switch ($.getEnv()) {
					case "Shadowrocket":
						break;
					case "Loon":
					case "Quantumult X":
						Panel.message += accountInfo;
						break;
					case "Surge":
					default:
					case "Stash":
						Panel.content += accountInfo;
						break;
				};
			};
			// 输出面板信息
			$.done(Panel);
			break;
		case false:
			$.log(`⚠ ${$.name}, 功能关闭`, "");
			break;
	};
})()
	.catch((e) => $.logErr(e))
	.finally(() => $.done())
/***************** Function *****************/
/**
 * Set Environment Variables
 * @author VirgilClyne
 * @param {String} name - Persistent Store Key
 * @param {Array} platforms - Platform Names
 * @param {Object} database - Default DataBase
 * @return {Object} { Settings, Caches, Configs }
 */
function setENV(name, platforms, database) {
	$.log(`☑️ ${$.name}, Set Environment Variables`, "");
	let { Settings, Caches, Configs } = getENV(name, platforms, database);
	/***************** Settings *****************/
	$.log(`✅ ${$.name}, Set Environment Variables`, `Settings: ${typeof Settings}`, `Settings内容: ${JSON.stringify(Settings)}`, "");
	/***************** Caches *****************/
	//$.log(`✅ ${$.name}, Set Environment Variables`, `Caches: ${typeof Caches}`, `Caches内容: ${JSON.stringify(Caches)}`, "");
	/***************** Configs *****************/
	return { Settings, Caches, Configs };
};
function formatTrace(trace, language = $environment?.language ?? "zh-Hans", i18n = DataBase.Panel.Configs.i18n) {
	switch (trace?.warp) {
		case "off":
			trace.warp += ` | ${i18n[language]?.WARP_Level_Off ?? 
"关闭"}`;
			break;
		case "on":
			trace.warp += ` | ${i18n[language]?.WARP_Level_On ?? "开启"}`;
			break;
		case "plus":
			trace.warp += ` | ${i18n[language]?.WARP_Level_Plus ?? 
"增强"}`;
			break;
		case undefined:
			break;
		default:
			trace.warp += ` | ${i18n[language]?.Unknown ?? "未知"}`;
			break;
	};
	return trace;
};
function formatAccount(account, language = $environment?.language ?? 
"zh-Hans", i18n = DataBase.Panel.Configs.i18n) {
	switch (account.account_type) {
		case "unlimited":
			account.data = {
				"type": `${account?.account_type?.toUpperCase()} | ${i18n[language]?.Account_Type_unlimited ?? 
"无限版"}`,
				"limited": false,
			}
			break;
		case "limited":
			account.data = {
				"type": `${account?.account_type?.toUpperCase()} | ${i18n[language]?.Account_Type_limited ?? 
"有限版"}`,
				"limited": true,
				"used": account.premium_data - account.quota,
				"flow": account.quota,
				"total": account.premium_data
			}
			break;
		case "team":
			account.data = {
				"type": `${account?.account_type?.toUpperCase()} | ${i18n[language]?.Account_Type_team ?? 
"团队版"}`,
				"limited": false,
			}
			break;
		case "plus":
			account.data = {
				"type": `${account?.account_type?.toUpperCase()} | ${i18n[language]?.Account_Type_plus ?? 
"WARP+"}`,
				"limited": false,
			}
			break;
		case "free":
			account.data = {
				"type": `${account?.account_type?.toUpperCase()} | ${i18n[language]?.Account_Type_free ?? 
"免费版"}`,
				"limited": true,
				"used": account.premium_data - account.quota,
				"flow": account.quota,
				"total": account.premium_data
			}
			break;
		default:
			account.data = {
				"type": `${account?.account_type} | ${i18n[language]?.Unknown ?? 
"未知"}`,
				"limited": undefined
			}
			break;
	};
	switch (account.data.limited) {
		case true:
			// 拼接文本
			account.data.text = `${i18n[language]?.Data_Info_Used ?? "已用"} | ${i18n[language]?.Data_Info_Residual ?? "剩余"} | ${i18n[language]?.Data_Info_Total ?? 
"总计"}`
				+ `\n${bytesToSize(account?.data?.used)} | ${bytesToSize(account?.data?.flow)} | ${bytesToSize(account?.data?.total)}`;
			/*
			account.data.text = `\n${i18n[language]?.Data_Info_Used ?? 
“已用流量”}： ${bytesToSize（account？.数据？。used）}' + '\n${i18n[language]？.Data_Info_Residual？？“剩余流量”}： ${bytesToSize（account？.数据？。flow）}' + '\n${i18n[language]？.Data_Info_Total？？

“总计流量”}： ${bytesToSize（account？.数据？。总计）}' */ 中断;大小写为假：帐户.数据.文本 = ' ♾️ |${i18n[语言]？.Data_Info_Unlimited？？“无限”}' 中断;默认值：帐户.数据.文本 = '未知 |${i18n[语言]？.未知？？“未知”}' 中断;} 返回帐户;};

异步函数 Cloudflare（Request = DataBase.WARP.Configs.Request， opt = “trace”） { /* let Request = { // Endpoint “url”： “https://api.cloudflareclient.com”， “headers”： { “Host”： “api.cloudflareclient.com”， “content-type”： “application/json”， “user-agent”： “1.1.1.1/2109031904.1 CFNetwork/1327.0.4 Darwin/21.2.0”， “cf-client-version”： “i-6.7-2109031904.1” }; */ let _Request = JSON.parse（JSON.stringify（Request））; switch （opt） { case “trace”： _Request.url = ”https://cloudflare.com/cdn-cgi/trace“;删除_Request.标题;返回等待格式CFJSON（_Request）;案例“trace4”：_Request.url = “https://1.1.1.1/cdn-cgi/trace”;删除_Request.标题;返回等待格式CFJSON（_Request）;案例 “trace6”： _Request.url = “https://[2606：4700：4700：：1111]/cdn-cgi/trace”;删除_Request.标题;返回等待格式CFJSON（_Request）;案例 “GET”： // GET Cloudflare JSON $.log（'GET'）;返回等待获取CFjson（_Request）;案例 “FATCH”： // FATCH Cloudflare JSON $.log（'FATCH'）;返回等待胖子（_Request）;};

/******* 函数 ******/ // Cloudflare JSON 格式异步函数格式 CFJSON（request） { return await $.http.get（request）.then（response => { let arr = response.body.trim（）.split（'\n'）.map（e => e.split（'='）） return Object.fromEntries（arr） }） };

函数 0A // Get Cloudflare JSON 函数 getCFjson（request） { return new Promise（（resolve） => { $.get（request， （error， response， data） => { try { if （error） throw new Error（error） else if （data） { const _data = JSON.parse（data） if （Array.isArray（_data.messages）） _data.messages.forEach（message => { if （message.code ！== 10000） $.msg（$.name， 'code： ${message.code}'， 'message： ${message.message}'）; }） switch （_data.success） { case true： resolve（_data？.结果？。[0] ??

_数据？。结果）;_data.结果，_data.元中断;case false： if （Array.isArray（_data.errors）） _data.errors.forEach（error => { $.msg（$.name， 'code： ${error.code}'， 'message： ${error.message}'）; }） break;未定义案例：解决（响应）;};} 否则抛出新的错误（响应）;} catch （e） { $.logErr（'${$.name}， ${getCFjson.name}执行失败'， 'request = ${JSON.stringify（request）}'， ' error = ${error || e}'， 'response = ${JSON.stringify（response）}'， 'data = ${data}'❗️， “”） } finally { resolve（） } }） }） };

函数 0B // Fatch Cloudflare JSON 函数 fatchCFjson（request） { return new Promise（（resolve） => { $.post（request， （error， response， data） => { try { if （error） throw new Error（error） else if （data） { const _data = JSON.parse（data） if （Array.isArray（_data.messages）） _data.messages.forEach（message => { if （message.code ！== 10000） $.msg（$.name， 'code： ${message.code}'， 'message： ${message.message}'）; }） switch （_data.success） { case true： resolve（_data？.结果？。[0] ??

_数据？。结果）;_data.结果，_data.元中断;case false： if （Array.isArray（_data.errors）） _data.errors.forEach（error => { $.msg（$.name， 'code： ${error.code}'， 'message： ${error.message}'）; }） break;未定义案例：解决（响应）;};} 否则抛出新的错误（响应）;} catch （e） { $.logErr（'${$.name}， ${fatchCFjson.name}执行失败'， 'request = ${JSON.stringify（request）}'， ' error = ${error || e}'， 'response = ${JSON.stringify（response）}'， 'data = ${data}'❗️， “”） } finally { resolve（） } }） }） };
}

/** * 构造重定向请求 * @author VirgilClyne * @param {对象} 请求 - 原始请求内容 * @param {对象} 代理名称 - 代理名称 * @return {对象} 使用策略修改请求内容 */ 函数 ReReqeust（request = {}， proxyName = “”） { $.log（' ⚠ ${$.name}， 构造重定向 reqeust'， “”）;if （proxyName） { if （$.isLoon（）） request.node = proxyName; if （$.isQuanX（）） { if （request.opts） request.opts.policy = proxyName; else request.opts = { “policy”： proxyName }; }; if （$.isSurge（）） { delete request.id; request.headers[“X-Surge-Policy”] = proxyName; request.policy = proxyName; }; if （$.isStash（）） request.headers[“X-Stash-Selected-Proxy”] = encodeURI（proxyName）; if （$.isShadowrocket（）） $.logErr（'${$.name}， ${Fetch.name}执行失败'， '不支持的app： Shadowrocket'❗️， “”）; }$.log（' ${$.name}， 构造重定向 reqeusts'🎉， “”）;退货请求;};

函数 bytesToSize（bytes = 0， Precision = 4） { if （bytes === 0） 返回 '0 B'; 常量 k = 1024; 常量大小 = ['B'， 'KB'， 'MB'， 'GB'， 'TB'， 'PB'， 'EB'， 'ZB'， 'YB']; CONST I = Math.floor（Math.log（bytes） / Math.log（k））; return （bytes / Math.pow（k， i））.toPrecision（Precision） + ' ' + size[i]; };

/******* Env ***** // prettier-ignore // https://github.com/chavyleung/scripts/blob/master/Env.min.js function Env（t，e）{class s{constructor（t）{this.env=t}send（t，e=“GET”）{t=“string”==typeof t？{url：t}：t;let s=this.get;return“POST”===e&&（s=this.post），new Promise（（e，a）=>{s.call（this，t，（t，s，r）=>{t？a（t）：e（s）}）}}get（t）{return this.send.call（this.env，t）}post（t）{return this.send.call（this.env，t，“POST”）}}return new class{constructor（t，e）{this.name=t，this.http=new s（this），this.data=null，this.dataFile=“box.dat”，this.logs=[]，this.isMute=！1，this.isNeedRewrite=！1，this.logSeparator=“\n”，this.encoding=“utf-8”，this.startTime=（new Date）.getTime（），Object.assign（this，e），this.log（“”，'\ud83d\udd14${this.name}， \u5f00\u59cb！'）}getEnv（）{return“undefined”！=typeof $environment&&$environment[“surge-version”]？”Surge“：”undefined“！=typeof $environment&&$environment[”stash-version“]？”Stash“：”undefined“！=typeof module&&module.exports？”Node.js“：”undefined“！=typeof $task？”Quantumult X“：”undefined“！=typeof $loon？”Loon“：”undefined“！=typeof $rocket？”Shadowrocket“：void 0}isNode（）{return”Node.js“===this.getEnv（）}isQuanX（）{return”Quantumult X“===this.getEnv（）}isSurge（）{return”Surge“===this.getEnv（）}isLoon（）{return”Loon“===this.getEnv（）}isShadowrocket（）{return”Shadowrocket“===this.getEnv（）}isStash（）{return”Stash“===this.getEnv（）}toObj（t，e=null）{try{return JSON.parse（t）}catch{return e}}toStr（t，e=null）{try{return JSON.stringify（t）}catch{return e}}getjson（t，e）{let s=e;const a=this.getdata（t）;if（a）try{s=JSON.parse（this.getdata（t））}catch{}return s}setjson（t，e）{try{return this.setdata（JSON.stringify（t），e）}catch{return！1}}getScript（t）{return new Promise（e=>{this.get（{url：t}，（t，s，a）=>e（a））}}runScript（t，e）{return new Promise（s=>{let a=this.getdata（“@chavy_boxjs_userCfgs.httpapi”）;a=a？a.replace（/\n/g，“”）.trim（）：a;let r=this.getdata（“@chavy_boxjs_userCfgs.httpapi_timeout”）;r=r？1*r：20，r=e&&e.timeout？e.timeout：r;const[i，o]=a.split（“@”），n={url：'http：//${o}/v1/scripting/evaluate'，body：{script_text：t，mock_type：“cron”，timeout：r}，headers：{“X-Key”：i，Accept：“*/*”}，timeout：r};this.post（n，（t，e，a）=>s（a））}）.catch（t=>this.logErr（t））}loaddata（）{if（！this.isNode（）））return{};{this.fs=this.fs？this.fs：require（“fs”），this.path=this.path？this.path：require（“path”）;const t=this.path.resolve（this.dataFile），e=this.path.resolve（process.cwd（），this.dataFile），s=this.fs.existsSync（t），a=！s&&this.fs.existsSync（e）;if（！s&&！a）return{};{const a=s？t：e;try{return JSON.parse（this.fs.readFileSync（a））}catch（t）{return{}}}writedata（）{if（this.isNode（））{this.fs=this.fs？this.fs：require（“fs”），this.path=this.path？this.path：require（“path”）;const t=this.path.resolve（this.dataFile），e=this.path.resolve（process.cwd（），this.dataFile），s=this.fs.existsSync（t），a=！s&&this.fs.existsSync（e），r=JSON.stringify（this.data）;s？this.fs.writeFileSync（t，r）：a？this.fs.writeFileSync（e，r）：this.fs.writeFileSync（t，r）}}lodash_get（t，e，s）{const a=e.replace（/\[（\d+）\]/g，“.$1”）.split（“.”）;let r=t;for（const t of a）if（r=Object（r）[t]，void 0===r）return s;return r}lodash_set（t，e，s）{return Object（t）！==t？t：（Array.isArray（e）||（e=e.toString（）.match（/[^.[\]]+/g）||[]），e.slice（0，-1）.reduce（（t，s，a）=>Object（t[s]）===t[s]？t[s]：t[s]=Math.abs（e[a+1]）>>0==+e[a+1]？[]：{}，t）[e[e.length-1]]=s，t）}getdata（t）{let e=this.getval（t）;if（/^@/.test（t））{const[，s，a]=/^@（.*？）\.(.*?)$/.exec（t），r=s？this.getval（s）：“”;if（r）try{const t=JSON.parse（r）;e=t？this.lodash_get（t，a，“”）：e}catch（t）{e=“”}}return e}setdata（t，e）{let s=！1;if（/^@/.test（e））{const[，a，r]=/^@（.*？）\.(.*?)$/.exec（e），i=this.getval（a），o=a？”null“===i？null：i||”{}“：”{}“;try{const e=JSON.parse（o）;this.lodash_set（e，r，t），s=this.setval（JSON.stringify（e），a）}catch（e）{const i={};this.lodash_set（i，r，t），s=this.setval（JSON.stringify（i），a）}}else s=this.setval（t，e）;return s}getval（t）{switch（this.getEnv（））{case“Surge”：case“Loon”：case“Stash”：case“Shadowrocket”：return $persistentStore.read（t）;case“Quantumult X”：return $prefs.valueForKey（t）;case“Node.js”：return this.data=this.loaddata（），this.data[t];d efault：return this.data&&this.data[t]||null}}setval（t，e）{switch（this.getEnv（））{case“Surge”：case“Loon”：case“Stash”：case“Shadowrocket”：return $persistentStore.write（t，e）;case“Quantumult X”：return $prefs.setValueForKey（t，e）;case“Node.js”：return this.data=this.loaddata（），this.data[e]=t，this.writedata（），！0;default：return this.data&&this.data[e]||null}}initGotEnv（t）{this.got=this.got？this.got：require（“got”），this.cktough=this.cktough？this.cktough：require（“tough-cookie”），this.ckjar=this.ckjar？this.ckjar：new this.cktough.CookieJar，t&&（t.headers=t.headers？t.headers：{}，void 0===t.headers.Cookie&&void 0===t.cookieJar&&（t.cookieJar=this.ckjar））}get（t，e=（（）=>{}））{switch（t.headers&&（delete t.headers[“Content-Type”]，delete t.headers[“Content-Length”]，delete t.headers[”content-length“]），this.getEnv（））{case”Surge“：case”Loon“：case”Stash“：case”Shadowrocket“:d efault：this.isSurge（）&&this.isNeedRewrite&&（t.headers=t.headers||{}，Object.assign（t.headers，{“X-Surge-Skip-Scripting”：！1}）），$httpClient.get（t，（t，s，a）=>{！t&&s&&（s.body=a，s.statusCode=s.status？s.status：s.statusCode，s.status=s.statusCode），e（t，s，a）}）;break;case“Quantumult X”：this.isNeedRewrite&&（t.opts=t.opts||{}，Object.assign（t.opts，{hints：！1}）），$task.fetch（t）.then（t=>{const{statusCode：s，statusCode：a，headers：r，body：i，bodyBytes：o}=t;e（null，{status：s，statusCode：a，headers：r，body：i，bodyBytes：o}，i，o）}，t=>e（t&&t.错误||”UndefinedError“））;break;case”Node.js“：let s=require（”iconv-lite“）;this.initGotEnv（t），this.got（t）.on（”redirect“，（t，e）=>{try{if（t.headers[”set-cookie“]）{const s=t.headers[”set-cookie“].map（this.cktough.Cookie.parse）.toString（）;s&&this.ckjar.setCookieSync（s，null），e.cookieJar=this.ckjar}}catch（t）{this.logErr（t）}}）.then（t=>{const{statusCode：a，statusCode：r，headers：i，rawBody：o}=t，n=s.decode（o，this.encoding）;e（null，{status：a，statusCode：r，headers：i，rawBody：o，body：n}，n）}，t=>{const{message：a，response：r}=t;e（a，r，r&&s.decode（r.rawBody，this.encoding））}）}}post（t，e=（（）=>{}））{const s=t.method？t.method.toLocaleLowerCase（）：“post”;switch（t.body&&t.headers&&！t.headers[“Content-Type”]&&！t.headers[“content-type”]&&（t.headers[“content-type”]=“application/x-www-form-urlencoded”），t.headers&&（delete t.headers[“Content-Length”]，delete t.headers[“content-length”]），this.getEnv（））{case“Surge”：case“Loon”：case“Stash”：case“Shadowrocket”:d efault：this.isSurge（）&&this.isNeedRewrite&&（t.headers=t.headers||{}，Object.assign（t.headers，{“X-Surge-Skip-Scripting”：！1}）），$httpClient[s]（t，（t，s，a）=>{！t&&s&&（s.body=a，s.statusCode=s.status？s.status：s.statusCode，s.status=s.statusCode），e（t，s，a）}）;break;case“Quantumult X”：t.method=s，this.isNeedRewrite&&（t.opts=t.opts||{}，Object.assign（t.opts，{hints：！1}）），$task.fetch（t）.then（t=>{const{statusCode：s，statusCode：a，headers：r，body：i，bodyBytes：o}=t;e（null，{status：s，statusCode：a，headers：r，body：i，bodyBytes：o}，i，o）}，t=>e（t&&t.error||”UndefinedError“））;break;case”Node.js“：let a=require（”iconv-lite“）;this.initGotEnv（t）;const{url：r,...i}=t;this.got[s]（r，i）.then（t=>{const{statusCode：s，statusCode：r，headers：i，rawBody：o}=t，n=a.decode（o，this.encoding）;e（null，{status：s，statusCode：r，headers：i，rawBody：o，body：n}，n）}，t=>{const{message：s，response：r}=t;e（s，r，r&&a.decode（r.rawBody，this.encoding））}）}}time（t，e=null）{const s=e？new Date（e）：new Date;let a={“M+”：s.getMonth（）+1，“d+”：s.getDate（），“H+”：s.getHours（），“m+”：s.getMinutes（），“s+”：s.getSeconds（），“q+”：Math.floor（（s.getMonth（）+3）/3），S：s.getMilliseconds（）};/（y+）/.test（t）&&（t=t.replace（RegExp.$1，（s.getFullYear（）+“”）.substr（4-RegExp.$1.length）））;for（let e in a）new RegExp（“（”+e+“）”）.test（t）&&（t=t.replace（RegExp.$1，1==RegExp.$1.length？a[e]:(“00”+a[e]）.substr（（“”+a[e]）.length）））;return t}queryStr（t）{let e=“”;for（const s in t）{let a=t[s];null！=a&&“”！==a&&（“object”==typeof a&&（a=JSON.stringify（a）），e+='${s}=${a}&'）}return e=e.substring（0，e.length-1），e}msg（e=t，s=“”，a=“”，r）{const i=t=>{switch（typeof t）{case void 0：return t;case“string”：switch（this.getEnv（））{case“Surge”：case“Stash”：default：return{url：t};case“Loon”：case“Shadowrocket”：return t;case“Quantumult X”：return{“open-url”：t};case“Node.js”：return}case“object”：switch（this.getEnv（））{case“Surge”：case“Stash”：case“Shadowrocket”:d efault：{let e=t.url||t.openUrl||t[“open-url”];return{url：e}}case“Loon”：{let e=t.openUrl||网址||t[“open-url”]，s=t.mediaUrl||t[“media-url”];return{openUrl：e，mediaUrl：s}}case“Quantumult X”：{let e=t[“open-url”]||网址||t.openUrl，s=t[“media-url”]||t.mediaUrl，a=t[“update-pasteboard”]||t.updatePasteboard;return{“open-url”：e，“media-url”：s，“update-pasteboard”：a}}case“Node.js”：return}default：return}};if（！！） this.isMute）switch（this.getEnv（））{case“Surge”：case“Loon”：case“Stash”：case“Shadowrocket”:d efault：$notification.post（e，s，a，i（r））;break;case“Quantumult X”：$notify（e，s，a，i（r））;break;case“Node.js”：}if（！！） this.isMuteLog）{let t=[“”，“==================\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3============================================================================================================================================================================================================================================================================s&&t.push（s），a&&t.push（a），console.log（t.join（“\n”）），this.logs=this.logs.concat（t）}}log（...t）{t.length>0&&（this.logs=[...这.日志,...t]），console.log（t.join（this.logSeparator））}logErr（t，e）{switch（this.getEnv（））{case“Surge”：case“Loon”：case“Stash”：case“Shadowrocket”：case“Quantumult X”:d efault：this.log（“”，'\u2757\ufe0f${this.name}， \u9519\u8bef！' ，t）;break;case“Node.js”：this.log（“”，'\u2757\ufe0f${this.name}， \u9519\u8bef！' ，t.stack）}}wait（t）{return new Promise（e=>setTimeout（e，t））}done（t={}）{const e=（new Date）.getTime（），s=（e-this.startTime）/1e3;switch（this.log（“”，'\ud83d\udd14${this.name}， \u7ed3\u675f！

\ud83d\udd5b ${s} \u79d2'），this.log（），this.getEnv（））{case“Surge”：case“Loon”：case“Stash”：case“Shadowrocket”：case“Quantumult X”:d efault：$done（t）;break;case“Node.js”:p rocess.exit（1）}}}（t，e）}

/** * 获取环境变量 * @link https://github.com/VirgilClyne/GetSomeFries/blob/main/function/getENV/getENV.min.js * @author VirgilClyne * @param {字符串} 键 - 持久存储密钥 * @param {数组} 名称 - 平台名称 * @param {对象} 数据库 - 默认数据库 * @return {对象} { 设置、缓存、配置 } */ 函数 getENV（key，names，database）{let BoxJs=$.getjson（key，database），Argument={};if（“undefined”！=typeof $argument&&Boolean（$argument））{let arg=Object.fromEntries（$argument.split（“&”）.map（（item=>item.split（“=”））））;for（let item in arg）setPath（Argument，item，arg[item]）}const Store={Settings：database？.违约？。设置||{}，Configs：database？.违约？。配置||{}，Caches：{}};Array.isArray（names）||（names=[names]）;for（let name of names）Store.Settings={...商店设置,...数据库？。[名称]？。设置。。。BoxJs？.[名称]？。设置。。。参数}，Store.Configs={...Store.Configs,...数据库？。[名称]？。配置}，BoxJs？.[名称]？。Caches&&“string”==typeof BoxJs？.[名称]？。Caches&&（BoxJs[name].Caches=JSON.parse（BoxJs？.[名称]？。Caches）），Store.Caches={...存储缓存,...BoxJs？.[名称]？。Caches};return function traverseObject（o，c）{for（var t in o）{var n=o[t];o[t]=“object”==typeof n&&null！==n？traverseObject（n，c）：c（t，n）}return o}（Store.Settings，（（key，value）=>（“true”===value||”false“===value？value=JSON.parse（value）：”string“==typeof value&&（value？.include（“，”）？value=value.split（“，”）：value&&！isNaN（value）&&（value=parseInt（value，10））），value））），Store;function setPath（object，path，value）{path.split（“.”）.reduce（（（o，p，i）=>o[p]=path.split（“.”）.长度===++i？值：O[p]||{}），对象）}}
