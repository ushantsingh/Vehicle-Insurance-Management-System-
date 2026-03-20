<p align="center">
  <img src="https://img.icons8.com/fluency/96/shield.png" alt="Insurify Logo" width="80" />
</p>

<h1 align="center">Insurify Pro — Enterprise Insurance Cloud</h1>

<p align="center">
  <strong>The ultimate insurance infrastructure that turns complex claim management into a seamless digital experience.</strong>
</p>

<blockquote align="center">
  "Secure, Scalable, and Sophisticated – redefining how organizations manage vehicle assets."
</blockquote>

---

## 🔗 Live Infrastructure

The production environment is live and accessible at:  
🚀 **[bespoke-peony-6146ef.netlify.app](https://bespoke-peony-6146ef.netlify.app)**

---

## 🏛️ Architecture Overview

Insurify Pro operates as a **Multi-Role Hybrid System**, managing state across three distinct authorization layers: The Employee Runtime, Managerial Workflow, and Administrative Intelligence.

---

## ⚙️ Configuration Flow

The system synchronizes user roles and dynamic claims using a centralized state object, ensuring that updates in the reporting layer reflect immediately in the audit trail.

```mermaid
graph TD
    A[index.html] -->|Load State| B(script.js Logic Engine)
    B -->|Render UI| C{Role Check}
    C -->|Employee| D[Incident Reporting]
    C -->|Manager| E[Authorization Queue]
    C -->|Admin| F[Intelligence Hub]
    D -->|New Claim| B
    E -->|Status Update| B
    F -->|System Purge| B
