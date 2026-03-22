"use client";

import { useState } from "react";
import { INIT_COLUMNS } from "../lib/constants";
import { Column } from "../components/board/Column";
import { TicketModal } from "../components/modals/TicketModal";
import { CreateTicketModal } from "../components/modals/CreateTicketModal";
import { MembersView } from "../components/team/MembersView";
import { Header } from "../components/layout/Header";
import { Toolbar } from "../components/layout/Toolbar";
import { useBoardData } from "../hooks/useBoardData";
import { Ticket } from "../types";

export default function App() {
  const [selectedProject, setSelectedProject] = useState("StratAI");
  const [view, setView] = useState("board");
  
  // Custom hook manages all Firestore data logic
  const { tickets, members, moveTicket, saveTicket, deleteTicket, createTicket } = useBoardData(selectedProject);

  const [columns] = useState(INIT_COLUMNS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [createFor, setCreateFor] = useState<string | null>(null);
  
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterLabel, setFilterLabel] = useState("all");

  const filtered = tickets.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterAssignee !== "all" && t.assignee !== filterAssignee) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterLabel !== "all" && !t.labels.includes(filterLabel)) return false;
    return true;
  });

  function handleDragStart(e: any, ticketId: string) {
    setDraggingId(ticketId);
    e.dataTransfer.effectAllowed = "move";
  }
  function handleDragEnd() { setDraggingId(null); setDragOver(null); }
  function handleDrop(e: any, colId: string) {
    e.preventDefault();
    if (draggingId) moveTicket(draggingId, colId);
    setDraggingId(null); setDragOver(null);
  }

  return (
    <div style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif", background: "#F3F4F6", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header 
        selectedProject={selectedProject} 
        setSelectedProject={setSelectedProject} 
        view={view} 
        setView={setView} 
        tickets={tickets} 
        members={members} 
      />

      {view === "members" ? (
        <MembersView members={members} tickets={tickets} onClose={() => setView("board")} />
      ) : (
        <>
          <Toolbar 
            search={search} setSearch={setSearch}
            filterAssignee={filterAssignee} setFilterAssignee={setFilterAssignee}
            filterPriority={filterPriority} setFilterPriority={setFilterPriority}
            filterLabel={filterLabel} setFilterLabel={setFilterLabel}
            members={members}
            onNewTicket={() => setCreateFor("todo")}
          />

          <div style={{ display: "flex", gap: 14, padding: "0 28px 28px", overflowX: "auto", flex: 1 }}>
            {columns.map(col => (
              <Column
                key={col.id}
                col={col}
                tickets={filtered.filter(t => t.column === col.id)}
                members={members}
                onTicketClick={setSelectedTicket}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                onDragOver={setDragOver}
                dragOver={dragOver}
                draggingId={draggingId}
                onAddTicket={setCreateFor}
              />
            ))}
          </div>
        </>
      )}

      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          members={members}
          columns={columns}
          onClose={() => setSelectedTicket(null)}
          onSave={saveTicket}
          onDelete={deleteTicket}
        />
      )}
      {createFor && (
        <CreateTicketModal
          defaultColumn={createFor}
          members={members}
          columns={columns}
          onClose={() => setCreateFor(null)}
          onCreate={createTicket}
        />
      )}
    </div>
  );
}
