import React, { useState, useEffect } from 'react';
import { Printer, Settings, Calendar, AlertCircle, Pill, Activity, Moon } from 'lucide-react';

// 模擬藥物資料庫
const ACUTE_MEDS_DB = [
  { id: 'panadol', name: 'Panadol (普拿疼)', color: 'bg-red-500', shape: 'rounded-full', desc: '圓形/白色' },
  { id: 'eve', name: 'EVE (布洛芬)', color: 'bg-white border-2 border-blue-500', shape: 'rounded-full', desc: '圓形/白色/藍字' },
  { id: 'cafergot', name: 'Cafergot (加非葛)', color: 'bg-orange-300', shape: 'rounded-full', desc: '圓形/米黃色' },
  { id: 'imigran', name: 'Imigran (英明格)', color: 'bg-pink-300', shape: 'rounded-md', desc: '長橢圓/粉色' },
  { id: 'arcoxia', name: 'Arcoxia (萬克適)', color: 'bg-green-200', shape: 'rounded-md', desc: '蘋果形/綠色' },
  { id: 'ultracet', name: 'Ultracet (及通安)', color: 'bg-yellow-200', shape: 'rounded-full', desc: '長橢圓/淡黃' },
  { id: 'rizatan', name: 'Rizatan (利扎翠)', color: 'bg-white border border-gray-300', shape: 'rounded-full', desc: '圓形/白色' },
];

const PREVENTIVE_MEDS_DB = [
  { id: 'topamax', name: 'Topamax (托佩瑪)', color: 'bg-white border-2 border-pink-400', shape: 'rounded-full', desc: '圓形/灑粉狀', warning: '注意手腳麻木感、多喝水預防腎結石、視力模糊請立即回診(青光眼風險)。', allowTitration: true },
  { id: 'depakine', name: 'Depakine (帝拔癲)', color: 'bg-white border-2 border-purple-500', shape: 'rounded-full', desc: '圓形/白色(長效)', warning: '可能引起體重增加、落髮、或影響肝功能。懷孕計畫者禁用。', allowTitration: false },
  { id: 'inderal', name: 'Inderal (恩特來)', color: 'bg-pink-500', shape: 'rounded-full', desc: '小圓形/粉紅', allowTitration: false },
  { id: 'flunarizine', name: 'Flunarizine (舒腦)', color: 'bg-red-200', shape: 'rounded-full', desc: '膠囊/紅色', allowTitration: true },
  { id: 'gabapentin', name: 'Gabapentin (卡巴本汀)', color: 'bg-yellow-400', shape: 'rounded-full', desc: '膠囊/黃色', allowTitration: false },
  { id: 'amitriptyline', name: 'Amitriptyline', color: 'bg-blue-300', shape: 'rounded-full', desc: '小圓形/藍色', allowTitration: false },
];

const HeadacheDiarySheet = () => {
  // 設定狀態
  const [daysCount, setDaysCount] = useState(14);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAcuteMeds, setSelectedAcuteMeds] = useState(['panadol', 'imigran']);
  const [selectedPreventiveMeds, setSelectedPreventiveMeds] = useState(['topamax']);
  const [enableTitration, setEnableTitration] = useState(true); // 是否啟用適應期標記
  const [isConfigOpen, setIsConfigOpen] = useState(true);

  // 產生日期陣列
  const generateDates = () => {
    const dates = [];
    const start = new Date(startDate);
    for (let i = 0; i < daysCount; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push({
        dayNum: i + 1,
        dateStr: `${d.getMonth() + 1}/${d.getDate()}`,
        obj: d
      });
    }
    return dates;
  };

  const dates = generateDates();

  // 處理藥物選擇
  const toggleAcute = (id) => {
    setSelectedAcuteMeds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const togglePreventive = (id) => {
    setSelectedPreventiveMeds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    setIsConfigOpen(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // 取得選中的藥物詳細資訊
  const activeAcuteMeds = ACUTE_MEDS_DB.filter(m => selectedAcuteMeds.includes(m.id));
  const activePreventiveMeds = PREVENTIVE_MEDS_DB.filter(m => selectedPreventiveMeds.includes(m.id));

  // 檢查是否需要顯示特定警語
  const showTopamaxWarning = selectedPreventiveMeds.includes('topamax');
  const showDepakineWarning = selectedPreventiveMeds.includes('depakine');

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans print:p-0 print:bg-white">
      
      {/* 設定面板 (列印時隱藏) */}
      {isConfigOpen && (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8 print:hidden border border-blue-200">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              頭痛衛教單張產生器設定
            </h2>
            <button 
              onClick={() => setIsConfigOpen(false)}
              className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
              隱藏設定預覽列印
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">起始日期</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">總天數 (建議14天以符合A4)</label>
                <select 
                  value={daysCount} 
                  onChange={(e) => setDaysCount(Number(e.target.value))}
                  className="w-full border rounded-md p-2"
                >
                  <option value={7}>7 天</option>
                  <option value={14}>14 天 (推薦)</option>
                  <option value={21}>21 天</option>
                  <option value={28}>28 天</option>
                  <option value={30}>30 天</option>
                </select>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={enableTitration}
                    onChange={(e) => setEnableTitration(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-bold text-blue-800">
                    啟用「前三天適應期」註記
                  </span>
                </label>
                <p className="text-xs text-gray-600 mt-1 pl-6">
                  針對 Topamax, Flunarizine 等藥物，自動在前三天標示「夜用」，提醒患者初期僅在睡前服用以適應副作用。
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-bold">急性止痛藥物 (可複選)</label>
                <div className="flex flex-wrap gap-2">
                  {ACUTE_MEDS_DB.map(med => (
                    <button
                      key={med.id}
                      onClick={() => toggleAcute(med.id)}
                      className={`px-3 py-1 rounded-full text-sm border ${selectedAcuteMeds.includes(med.id) ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                    >
                      {med.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-bold">預防性用藥 (可複選)</label>
                <div className="flex flex-wrap gap-2">
                  {PREVENTIVE_MEDS_DB.map(med => (
                    <button
                      key={med.id}
                      onClick={() => togglePreventive(med.id)}
                      className={`px-3 py-1 rounded-full text-sm border ${selectedPreventiveMeds.includes(med.id) ? 'bg-purple-100 border-purple-500 text-purple-700' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                    >
                      {med.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-5 h-5" />
              列印 / 下載 PDF
            </button>
          </div>
        </div>
      )}

      {/* 以下為列印區域 A4 Landscape */}
      {!isConfigOpen && (
         <div className="print:hidden mb-4 text-center">
             <button onClick={() => setIsConfigOpen(true)} className="bg-gray-200 px-4 py-2 rounded text-gray-700">回到設定</button>
             <button onClick={handlePrint} className="ml-4 bg-blue-600 text-white px-4 py-2 rounded">確認列印</button>
         </div>
      )}

      <div className="mx-auto bg-white shadow-none print:shadow-none print:w-full print:h-full max-w-[297mm] overflow-hidden">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-2 mb-2 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">頭痛日記 & 藥物使用紀錄表</h1>
            <p className="text-sm text-gray-600 mt-1">
              姓名: _______________ &nbsp;&nbsp; 病歷號: _______________ &nbsp;&nbsp; 醫師: _______________
            </p>
          </div>
          <div className="text-right text-xs text-gray-500">
            請每日睡前記錄，就診時請務必攜帶此表。
          </div>
        </div>

        <div className="flex">
          {/* Main Table Area */}
          <div className="flex-grow">
            <table className="w-full border-collapse border border-gray-800 text-sm">
              <thead>
                {/* 第一列：天數 */}
                <tr>
                  <th className="border border-gray-600 bg-gray-100 w-32 p-1 text-left text-xs">項次 / 天數</th>
                  {dates.map(d => (
                    <th key={d.dayNum} className="border border-gray-600 text-center w-8 bg-gray-50 text-xs">{d.dayNum}</th>
                  ))}
                </tr>
                {/* 第二列：日期 */}
                <tr>
                  <th className="border border-gray-600 bg-gray-100 p-1 text-left text-xs">日期</th>
                  {dates.map(d => (
                    <th key={d.dayNum} className="border border-gray-600 text-center text-[10px] font-normal">{d.dateStr}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 疼痛程度 (早中晚) */}
                <tr>
                  <td className="border border-gray-600 p-1 font-bold bg-red-50 text-xs" colSpan={dates.length + 1}>
                    疼痛程度 (請填寫 1, 2, 3) 
                    <span className="font-normal text-gray-600 ml-2">
                      1:輕微(不影響作息) / 2:中度(影響專注) / 3:嚴重(需臥床)
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-1 text-xs text-center font-bold">早</td>
                  {dates.map(d => <td key={d.dayNum} className="border border-gray-600"></td>)}
                </tr>
                <tr>
                  <td className="border border-gray-600 p-1 text-xs text-center font-bold">中</td>
                  {dates.map(d => <td key={d.dayNum} className="border border-gray-600"></td>)}
                </tr>
                <tr>
                  <td className="border border-gray-600 p-1 text-xs text-center font-bold">晚</td>
                  {dates.map(d => <td key={d.dayNum} className="border border-gray-600"></td>)}
                </tr>

                {/* 伴隨症狀 */}
                <tr>
                  <td className="border border-gray-600 p-1 font-bold bg-yellow-50" colSpan={dates.length + 1}>伴隨症狀 (有則打勾)</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-1 text-xs">噁心 / 嘔吐</td>
                  {dates.map(d => <td key={d.dayNum} className="border border-gray-600"></td>)}
                </tr>
                <tr>
                  <td className="border border-gray-600 p-1 text-xs">怕光 / 怕吵</td>
                  {dates.map(d => <td key={d.dayNum} className="border border-gray-600"></td>)}
                </tr>
                <tr>
                  <td className="border border-gray-600 p-1 text-xs">視覺預兆 <span className="text-[10px] text-gray-500">(閃光/鋸齒)</span></td>
                  {dates.map(d => <td key={d.dayNum} className="border border-gray-600"></td>)}
                </tr>

                {/* 持續時間 */}
                <tr>
                  <td className="border border-gray-600 p-1 font-bold bg-blue-50" colSpan={dates.length + 1}>持續時間</td>
                </tr>
                <tr>
                  <td className="border border-gray-600 p-1 text-xs">超過 4 小時</td>
                  {dates.map(d => <td key={d.dayNum} className="border border-gray-600"></td>)}
                </tr>
                <tr>
                  <td className="border border-gray-600 p-1 text-xs">小於 4 小時</td>
                  {dates.map(d => <td key={d.dayNum} className="border border-gray-600"></td>)}
                </tr>

                {/* 用藥紀錄 - 急性 */}
                <tr>
                  <td className="border border-gray-600 p-1 font-bold bg-green-50" colSpan={dates.length + 1}>急性止痛藥 (紀錄顆數)</td>
                </tr>
                {activeAcuteMeds.length > 0 ? activeAcuteMeds.map((med) => (
                  <tr key={med.id}>
                    <td className="border border-gray-600 p-1 text-xs truncate max-w-[120px]" title={med.name}>{med.name}</td>
                    {dates.map(d => <td key={d.dayNum} className="border border-gray-600"></td>)}
                  </tr>
                )) : (
                  <tr>
                    <td className="border border-gray-600 p-1 text-xs text-gray-400">未選用藥物</td>
                    {dates.map(d => <td key={d.dayNum} className="border border-gray-600"></td>)}
                  </tr>
                )}

                {/* 用藥紀錄 - 預防性 */}
                <tr>
                  <td className="border border-gray-600 p-1 font-bold bg-purple-50" colSpan={dates.length + 1}>預防性用藥 (有吃打勾)</td>
                </tr>
                {activePreventiveMeds.length > 0 ? activePreventiveMeds.map((med) => (
                  <tr key={med.id}>
                     <td className="border border-gray-600 p-1 text-xs truncate max-w-[120px] relative" title={med.name}>
                       {med.name}
                       {/* 若有適應期且啟用，顯示小標記在藥名旁 */}
                       {enableTitration && med.allowTitration && (
                         <span className="absolute right-1 top-1 text-[8px] text-gray-500 bg-gray-100 px-1 rounded">
                           前3日適應
                         </span>
                       )}
                     </td>
                    {dates.map((d, index) => {
                      // 判斷是否為適應期格子
                      const isTitrationCell = enableTitration && med.allowTitration && index < 3;
                      return (
                        <td key={d.dayNum} className="border border-gray-600 text-center relative">
                          {isTitrationCell && (
                            <span className="text-[10px] text-gray-400 font-bold block leading-none transform scale-90 mt-0.5">
                              夜用
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )) : (
                   <tr>
                    <td className="border border-gray-600 p-1 text-xs text-gray-400">未選用藥物</td>
                    {dates.map(d => <td key={d.dayNum} className="border border-gray-600"></td>)}
                  </tr>
                )}

                {/* 運動狀況 */}
                <tr>
                   <td className="border border-gray-600 p-1 font-bold text-xs">運動狀況 (分鐘)</td>
                   {dates.map(d => <td key={d.dayNum} className="border border-gray-600"></td>)}
                </tr>
              </tbody>
            </table>
          </div>

          {/* 右欄：藥物長相與備註 */}
          <div className="w-56 ml-2 border border-gray-800 flex flex-col">
            <div className="bg-gray-800 text-white text-center p-1 text-sm font-bold">藥物辨識與備註</div>
            
            <div className="flex-grow p-2 space-y-4 overflow-hidden">
              
              {/* 急性藥物圖示 */}
              {activeAcuteMeds.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold border-b border-gray-300 mb-1 text-green-700">急性用藥</h3>
                  {activeAcuteMeds.map(med => (
                    <div key={med.id} className="flex items-center gap-2 mb-2">
                       <div className={`w-4 h-4 shadow-sm flex-shrink-0 ${med.shape} ${med.color}`}></div>
                       <div className="text-[10px] leading-tight">
                         <div className="font-bold">{med.name}</div>
                         <div className="text-gray-500 scale-90 origin-top-left">{med.desc}</div>
                       </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 預防性藥物圖示 */}
               {activePreventiveMeds.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold border-b border-gray-300 mb-1 mt-2 text-purple-700">預防用藥</h3>
                  {activePreventiveMeds.map(med => (
                    <div key={med.id} className="flex items-center gap-2 mb-2">
                       <div className={`w-4 h-4 shadow-sm flex-shrink-0 ${med.shape} ${med.color}`}></div>
                       <div className="text-[10px] leading-tight">
                         <div className="font-bold">{med.name}</div>
                         <div className="text-gray-500 scale-90 origin-top-left">{med.desc}</div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 底部醫師欄位 */}
            <div className="mt-auto border-t border-gray-400 p-2 text-xs">
              <p className="font-bold mb-1">下次預約:</p>
              <div className="border-b border-gray-300 h-4 mb-2"></div>
              <p>請記錄頭痛發作時的嚴重程度與用藥反應。</p>
            </div>
          </div>
        </div>

        {/* 底部：注意事項區域 */}
        <div className="mt-3 grid grid-cols-2 gap-4 border border-gray-400 p-3 rounded bg-gray-50 text-xs">
          <div>
            <h4 className="font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3" /> 一般注意事項
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>若一週需使用急性止痛藥超過2天，請與醫師討論。</li>
              <li>規律運動(每週3次，每次30分鐘)有助於改善偏頭痛。</li>
              <li>避免過度依賴止痛藥以免造成「藥物過度使用頭痛」。</li>
            </ul>
          </div>
          
          <div>
            {/* 動態顯示特定藥物警語 */}
            {(showTopamaxWarning || showDepakineWarning || enableTitration) && (
              <>
                <h4 className="font-bold text-red-600 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> 特定藥物警示
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {showTopamaxWarning && (
                    <li className="text-red-700">
                      <span className="font-bold">Topamax:</span> {PREVENTIVE_MEDS_DB.find(m=>m.id==='topamax').warning}
                    </li>
                  )}
                  {showDepakineWarning && (
                    <li className="text-red-700">
                      <span className="font-bold">Depakine:</span> {PREVENTIVE_MEDS_DB.find(m=>m.id==='depakine').warning}
                    </li>
                  )}
                  {/* 若開啟適應期功能且有選相關藥物，增加通用的適應期說明 */}
                  {enableTitration && activePreventiveMeds.some(m => m.allowTitration) && (
                    <li className="text-gray-600 font-bold">
                       <Moon className="w-3 h-3 inline mr-1"/>
                       適應期藥物：前三天請於睡前服用，以減少頭暈/嗜睡副作用。
                    </li>
                  )}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 5mm;
          }
          body {
            background: white;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:w-full {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeadacheDiarySheet;
