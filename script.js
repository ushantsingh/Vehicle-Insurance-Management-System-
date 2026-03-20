/**
 * Insurify Pro - Enterprise Logic Engine
 * Full Integrated Version
 */

// 1. GLOBAL STATE (DATABASE SIMULATION)
let appState = {
    policies: [
        { id: 'POL-3940', vehicle: 'NY-882-JK', expiry: '2026-11-20', status: 'Active', type: 'Comprehensive' },
        { id: 'POL-1102', vehicle: 'CA-109-PL', expiry: '2026-05-12', status: 'Active', type: 'Third Party' }
    ],
    claims: [
        { id: 'INC-7701', requester: 'Ushant Singh', type: 'Collision', status: 'Pending', date: '2026-03-18', file: 'accident_scene.jpg' },
        { id: 'INC-6620', requester: 'Arya Singh', type: 'Theft', status: 'Approved', date: '2026-02-14', file: 'police_report.pdf' }
    ],
    logs: [],
    currentRole: 'user'
};

// DOM SELECTORS
const authContainer = document.getElementById('auth-container');
const mainDashboard = document.getElementById('main-dashboard');
const contentArea = document.getElementById('content-area');
const userDisplay = document.getElementById('user-display');
const userRoleLabel = document.getElementById('user-role-label');
const dashTitle = document.getElementById('dash-title');
const currentDate = document.getElementById('current-date');

// 2. CORE UTILITY ACTIONS
window.downloadPolicy = function(id) {
    const text = `INSURIFY PRO\nOFFICIAL POLICY DOCUMENT\nID: ${id}\nSTATUS: ACTIVE\nRENEWAL: 2026\nDigitally Verified.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${id}_Insurance_Policy.txt`;
    link.click();
};

window.startLiveChat = () => alert("System: Connecting to a live agent... Please wait.");
window.toggleProfileModal = () => document.getElementById('profile-modal').classList.toggle('hidden');

// 3. RESPONSIVE SIDEBAR LOGIC
window.toggleSidebar = function() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
};

window.closeSidebarOnMobile = function() {
    if (window.innerWidth < 1024) toggleSidebar();
};

// 4. AUTHENTICATION & NAVIGATION
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    appState.currentRole = document.getElementById('role-select').value;
    startAppSession();
});

function logout() {
    location.reload();
}

function startAppSession() {
    authContainer.classList.add('hidden');
    mainDashboard.classList.remove('hidden');
    userDisplay.innerText = appState.currentRole === 'manager' ? 'Admin Manager' : (appState.currentRole === 'admin' ? 'System Admin' : 'Ushant Singh');
    userRoleLabel.innerText = appState.currentRole;
    currentDate.innerText = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    navigateTo('dashboard');
}

window.navigateTo = function(page) {
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active', 'bg-blue-600', 'text-white'));
    const activeLink = document.getElementById(`nav-${page}`);
    if(activeLink) activeLink.classList.add('active', 'bg-blue-600', 'text-white');

    if (appState.currentRole === 'user') {
        switch(page) {
            case 'dashboard': renderEmployeePortal(); break;
            case 'policy': renderPolicyCenter(); break;
            case 'history': renderFullHistory(); break;
            case 'support': renderSupportPage(); break;
        }
    } else if (appState.currentRole === 'manager') {
        switch(page) {
            case 'dashboard': renderManagerQueue(); break;
            case 'policy': renderManagerPolicies(); break;
            case 'history': renderManagerLogs(); break;
            case 'support': renderSupportPage(); break;
        }
    } else if (appState.currentRole === 'admin') {
        // NEW ADMIN ROUTING ADDED WITHOUT CHANGING OLD LOGIC
        switch(page) {
            case 'dashboard': renderAdminIntelligence(); break;
            case 'policy': renderAdminGlobalPolicies(); break;
            case 'history': renderAdminSystemLogs(); break;
            case 'support': renderAdminSupportSettings(); break;
        }
    }
};

// 5. TRANSACTIONAL HANDLERS
window.handleFileUpload = (input) => {
    const label = document.getElementById('upload-status');
    if (input.files && input.files[0]) {
        label.innerHTML = `<span class="text-blue-600 font-bold italic"><i class="fas fa-check-circle"></i> ${input.files[0].name}</span>`;
    }
};

window.submitIncident = (e) => {
    e.preventDefault();
    const plateId = e.target.querySelector('input').value;
    if (!plateId) return alert("Enter Plate ID");

    const newID = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
    appState.claims.unshift({
        id: newID, requester: 'Ushant Singh', type: e.target.querySelector('select').value,
        status: 'Pending', date: new Date().toISOString().split('T')[0], file: 'doc.jpg'
    });
    alert(`Incident ${newID} Registered Successfully.`);
    renderEmployeePortal();
};

window.changeClaimStatus = (id, newStatus) => {
    const item = appState.claims.find(c => c.id === id);
    if (item) {
        item.status = newStatus;
        appState.logs.unshift({ msg: `Ticket ${id} ${newStatus}`, time: new Date().toLocaleTimeString() });
        renderManagerQueue();
    }
};

// 6. VIEW TEMPLATES

function renderEmployeePortal() {
    dashTitle.innerText = "Employee Self-Service Dashboard";
    contentArea.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade text-left">
            <div class="lg:col-span-4 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                <h3 class="text-xl font-bold mb-6 text-slate-800">Register Incident</h3>
                <form onsubmit="submitIncident(event)" class="space-y-6">
                    <input type="text" placeholder="Plate ID (e.g. NY-882-JK)" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-500 font-medium transition-all" required>
                    <select class="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-600 cursor-pointer">
                        <option>Collision Damage</option><option>Total Theft</option><option>Natural Disaster</option>
                    </select>
                    <div class="p-8 border-2 border-dashed border-slate-200 rounded-[2rem] text-center bg-slate-50/50 hover:bg-white hover:border-blue-400 cursor-pointer transition-all" onclick="document.getElementById('incident-upload').click()">
                        <i class="fas fa-paperclip text-2xl text-slate-300 mb-2"></i>
                        <p id="upload-status" class="text-xs text-slate-400 font-bold uppercase tracking-widest">Attach Proof</p>
                        <input type="file" id="incident-upload" class="hidden" onchange="handleFileUpload(this)">
                    </div>
                    <button type="submit" class="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-blue-600 transition-all active:scale-95">Dispatch Request</button>
                </form>
            </div>
            <div class="lg:col-span-8 space-y-4">
                <h3 class="text-xl font-bold mb-6 text-slate-800 italic">Recent Activity</h3>
                ${appState.claims.slice(0, 4).map(c => `
                    <div class="bg-white p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm border border-slate-100 hover:border-blue-200 transition-all">
                        <div class="flex items-center gap-5">
                            <div class="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><i class="fas fa-file-invoice text-xl"></i></div>
                            <div><p class="font-extrabold text-slate-800 text-lg tracking-tight">${c.id} — ${c.type}</p><p class="text-[10px] font-bold text-slate-400 uppercase mt-1 italic">Logged: ${c.date}</p></div>
                        </div>
                        <span class="px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${c.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}">${c.status}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderManagerQueue() {
    dashTitle.innerText = "Manager Workflow Console";
    const pending = appState.claims.filter(c => c.status === 'Pending');
    contentArea.innerHTML = `
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden animate-fade">
            <div class="p-6 bg-slate-900 text-white flex justify-between items-center"><h3 class="font-bold italic text-sm uppercase">Pending Review</h3><span class="bg-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">${pending.length} Tasks</span></div>
            <table class="w-full text-left">
                <tbody class="divide-y divide-slate-50">
                    ${pending.map(c => `
                        <tr>
                            <td class="p-6 font-bold text-blue-600 italic text-sm tracking-tight">${c.id}</td>
                            <td class="p-6 text-sm font-bold text-slate-600 uppercase tracking-tight">${c.requester}</td>
                            <td class="p-6 flex gap-3">
                                <button onclick="changeClaimStatus('${c.id}', 'Approved')" class="bg-emerald-500 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">Authorize</button>
                                <button onclick="changeClaimStatus('${c.id}', 'Rejected')" class="bg-rose-500 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all">Dismiss</button>
                            </td>
                        </tr>
                    `).join('') || `<tr><td colspan="3" class="p-20 text-center text-slate-300 font-black tracking-widest uppercase">No pending items found.</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
}

function renderManagerPolicies() {
    dashTitle.innerText = "Enterprise Policy Master List";
    contentArea.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade">
            ${appState.policies.map(p => `
                <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:translate-y-[-5px] transition-all">
                    <span class="text-[10px] font-black uppercase bg-blue-50 text-blue-600 px-2 py-1 rounded">${p.type}</span>
                    <h4 class="text-xl font-black mt-2">${p.id}</h4>
                    <p class="text-xs text-slate-400 uppercase font-bold mt-1">${p.vehicle}</p>
                    <button onclick="downloadPolicy('${p.id}')" class="w-full mt-4 bg-slate-900 text-white py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all">Download Documentation</button>
                </div>
            `).join('')}
        </div>
    `;
}

function renderManagerLogs() {
    dashTitle.innerText = "System Audit History";
    contentArea.innerHTML = `
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 animate-fade">
            <h3 class="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] mb-4">Approval Trail</h3>
            <div class="space-y-3">
                ${appState.logs.map(l => `<div class="p-5 bg-slate-50 rounded-2xl flex justify-between items-center border-l-8 border-blue-500 shadow-sm"><span class="text-xs font-bold text-slate-700 uppercase tracking-tight">${l.msg}</span><span class="text-[9px] text-slate-300 font-black italic uppercase">${l.time}</span></div>`).join('') || '<p class="text-center py-20 text-slate-300 uppercase font-black tracking-widest italic">No transactions recorded</p>'}
            </div>
        </div>
    `;
}

function renderPolicyCenter() {
    dashTitle.innerText = "Policy Center";
    contentArea.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade text-left">
            ${appState.policies.map(p => `
                <div class="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 border-l-8 border-blue-600 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-start mb-6"><span class="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">${p.type}</span><i class="fas fa-shield-check text-slate-200 text-3xl"></i></div>
                        <h4 class="text-3xl font-black text-slate-800 tracking-tighter italic">${p.id}</h4>
                        <p class="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest leading-none">Vehicle: ${p.vehicle}</p>
                    </div>
                    <div class="mt-8 pt-6 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div><p class="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Renewal Date</p><p class="text-sm font-bold text-slate-700">${p.expiry}</p></div>
                        <button onclick="downloadPolicy('${p.id}')" class="bg-slate-900 text-white text-[10px] font-black px-6 py-4 rounded-xl uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">Download PDF</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderFullHistory() {
    dashTitle.innerText = "Transaction Ledger";
    contentArea.innerHTML = `
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-fade">
            <div class="overflow-x-auto">
                <table class="w-full text-left min-w-[600px]">
                    <thead class="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                        <tr><th class="p-8">Incident Ref</th><th class="p-8">Category</th><th class="p-8">Date</th><th class="p-8">Workflow Status</th></tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        ${appState.claims.map(c => `
                            <tr>
                                <td class="p-8 font-black text-blue-600 italic tracking-tight">${c.id}</td>
                                <td class="p-8 text-xs font-bold text-slate-500 uppercase tracking-tight">${c.type}</td>
                                <td class="p-8 text-sm text-slate-400 font-medium">${c.date}</td>
                                <td class="p-8"><span class="px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${c.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-700'}">${c.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderSupportPage() {
    dashTitle.innerText = "Support Infrastructure";
    contentArea.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade text-left">
            <div class="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 class="text-2xl font-black mb-6 text-slate-800 tracking-tight italic">Technical Assistance</h3>
                <div class="space-y-6">
                    <a href="tel:18005556677" class="flex gap-6 p-8 bg-slate-50 rounded-3xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-200 group">
                        <i class="fas fa-headset text-3xl text-blue-500"></i>
                        <div><p class="font-black text-slate-800 group-hover:text-blue-600">24/7 Helpline</p><p class="text-xs text-slate-400 font-bold uppercase mt-1 italic tracking-widest">1-800-INSURIFY-PRO</p></div>
                    </a>
                    <a href="mailto:claims@insurify.com" class="flex gap-6 p-8 bg-slate-50 rounded-3xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-200 group">
                        <i class="fas fa-envelope-open text-3xl text-blue-500"></i>
                        <div><p class="font-black text-slate-800 group-hover:text-blue-600">Email Desk</p><p class="text-xs text-slate-400 font-bold uppercase mt-1 italic tracking-widest">claims@insurify.com</p></div>
                    </a>
                </div>
            </div>
            <div class="bg-slate-900 p-10 rounded-[2.5rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <i class="fas fa-life-ring absolute -right-10 -top-10 text-[10rem] text-white/5 rotate-12"></i>
                <div><h4 class="text-xl font-black mb-4 uppercase tracking-widest italic text-blue-400">Policy Hub</h4><p class="text-xs text-slate-400 leading-relaxed font-medium font-semibold italic opacity-80">Connect with Tier 1 specialists for real-time claim support.</p></div>
                <button onclick="startLiveChat()" class="bg-blue-600 text-white w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] mt-8 shadow-xl hover:bg-blue-500 transition-all">Start Live Chat</button>
            </div>
        </div>
    `;
}

function renderAdminIntelligence() {
    dashTitle.innerText = "System Intelligence Hub";
    contentArea.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade text-left">
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"><p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Portfolio</p><h4 class="text-4xl font-black text-blue-900 tracking-tighter">${appState.policies.length}</h4></div>
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"><p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Critical Alerts</p><h4 class="text-4xl font-black text-rose-500 tracking-tighter">02</h4></div>
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"><p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Settled Assets</p><h4 class="text-4xl font-black text-emerald-500 tracking-tighter">${appState.claims.length}</h4></div>
            <div class="bg-blue-600 p-8 rounded-3xl shadow-lg text-white"><p class="text-[9px] font-black uppercase opacity-70 tracking-widest">Compliance Rate</p><h4 class="text-4xl font-black tracking-tighter italic">100%</h4></div>
        </div>
    `;
}

// --- NEW ADMIN FEATURES ADDED BELOW ---

function renderAdminGlobalPolicies() {
    dashTitle.innerText = "Global Policy Infrastructure";
    contentArea.innerHTML = `
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 animate-fade">
            <div class="flex justify-between items-center mb-8">
                <h3 class="text-xl font-bold text-slate-800 tracking-tight">Active Corporate Portfolio</h3>
                <button class="bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700">+ New Policy Group</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${appState.policies.map(p => `
                    <div class="p-6 border rounded-3xl flex justify-between items-center hover:border-blue-500 transition-all bg-slate-50/30">
                        <div>
                            <p class="font-black text-slate-800">${p.id}</p>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">${p.vehicle} — ${p.type}</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="downloadPolicy('${p.id}')" class="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"><i class="fas fa-download text-[12px]"></i></button>
                            <button class="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"><i class="fas fa-trash text-[12px]"></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAdminSystemLogs() {
    dashTitle.innerText = "System-Wide Audit History";
    contentArea.innerHTML = `
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 animate-fade">
            <div class="flex justify-between items-center mb-6 border-b pb-4">
                <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest">Administrative Trace</h3>
                <button onclick="appState.logs = []; renderAdminSystemLogs();" class="text-rose-500 text-[10px] font-black uppercase tracking-widest hover:underline">Purge Logs</button>
            </div>
            <div class="space-y-4">
                ${appState.logs.map(log => `
                    <div class="p-5 bg-slate-50 rounded-2xl border-l-8 border-slate-900 flex justify-between items-center shadow-sm">
                        <span class="text-xs font-bold text-slate-700 uppercase tracking-tight">${log.msg}</span>
                        <span class="text-[9px] font-black text-slate-300 italic uppercase tracking-widest">${log.time}</span>
                    </div>
                `).join('') || '<div class="text-center py-20 text-slate-200 font-black uppercase tracking-[0.3em] italic">No Logs Registered</div>'}
            </div>
        </div>
    `;
}

function renderAdminSupportSettings() {
    dashTitle.innerText = "Support & System Configuration";
    contentArea.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade">
            <div class="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h3 class="text-xl font-bold mb-6 italic tracking-tight">Backend Status</h3>
                <div class="space-y-4">
                    <div class="p-5 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                        <span class="text-xs font-bold uppercase tracking-tight text-slate-500">Live Chat Engine</span>
                        <span class="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase">
                            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Online
                        </span>
                    </div>
                    <div class="p-5 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                        <span class="text-xs font-bold uppercase tracking-tight text-slate-500">SMTP Relay</span>
                        <span class="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase">
                            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Active
                        </span>
                    </div>
                </div>
            </div>
            <div class="bg-slate-900 p-10 rounded-[2.5rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <i class="fas fa-microchip absolute -right-10 -top-10 text-[10rem] text-white/5 rotate-12"></i>
                <div>
                    <h4 class="text-xl font-black mb-4 uppercase tracking-widest italic text-blue-400">Maintenance Protocol</h4>
                    <p class="text-xs text-slate-400 leading-relaxed font-medium">Activating maintenance mode will freeze all new incident registrations across the enterprise platform.</p>
                </div>
                <button onclick="alert('System entering maintenance mode...')" class="bg-rose-500 text-white w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] mt-8 shadow-xl hover:bg-rose-600 transition-all">Enable Maintenance</button>
            </div>
        </div>
    `;
}