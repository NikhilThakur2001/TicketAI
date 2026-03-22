import { useState, useEffect, useCallback } from "react";
import { collection, onSnapshot, doc, setDoc, deleteDoc, query } from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { Ticket, Member } from "../types";

export function useBoardData(selectedProject: string) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [ticketCounter, setTicketCounter] = useState(1);

  // Initialize counter from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kanban_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.counter) setTicketCounter(parsed.counter);
      }
    } catch {}
  }, []);

  // Sync counter to localStorage
  useEffect(() => {
    try { localStorage.setItem("kanban_v1", JSON.stringify({ counter: ticketCounter })); } catch {}
  }, [ticketCounter]);

  // Fetch Users
  useEffect(() => {
    const uq = query(collection(db, "users"));
    const unsubUsers = onSnapshot(uq, (snapshot) => {
      const dbUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Member[];
      setMembers(dbUsers);
    });
    return () => unsubUsers();
  }, []);

  // Fetch Tickets
  useEffect(() => {
    const tq = query(collection(db, `tickets_${selectedProject.toLowerCase()}`));
    const unsubTickets = onSnapshot(tq, (snapshot) => {
      const dbTickets = snapshot.docs.map(changeDoc => ({ id: changeDoc.id, ...changeDoc.data() })) as Ticket[];
      setTickets(dbTickets);
    });
    return () => unsubTickets();
  }, [selectedProject]);

  const moveTicket = useCallback((ticketId: string, toColumn: string) => {
    setTickets(ts => ts.map(t => t.id === ticketId ? { ...t, column: toColumn } : t));
    setDoc(doc(db, `tickets_${selectedProject.toLowerCase()}`, ticketId), { column: toColumn }, { merge: true });
  }, [selectedProject]);

  const saveTicket = useCallback((updated: Ticket) => {
    setTickets(ts => {
      const oldTicket = ts.find(t => t.id === updated.id);
      if (oldTicket && oldTicket.assignee !== updated.assignee && updated.assignee) {
        const u = members.find(m => m.id === updated.assignee);
        if (u?.email) {
          fetch("/api/send-email", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({
            to: u.email, subject: `Ticket Reassigned: ${updated.id}`, text: `You've been reassigned ticket ${updated.id}: ${updated.title}`
          })}).catch(() => {});
        }
      }
      return ts.map(t => t.id === updated.id ? updated : t);
    });
    setDoc(doc(db, `tickets_${selectedProject.toLowerCase()}`, updated.id), updated, { merge: true });
  }, [selectedProject, members]);

  const deleteTicket = useCallback((id: string) => {
    setTickets(ts => ts.filter(t => t.id !== id));
    deleteDoc(doc(db, `tickets_${selectedProject.toLowerCase()}`, id));
  }, [selectedProject]);

  const createTicket = useCallback((ticket: any) => {
    const id = `${selectedProject.substring(0,6).toUpperCase()}-${String(ticketCounter).padStart(3, "0")}`;
    const newTicket = { ...ticket, id } as Ticket;
    setTickets(ts => [...ts, newTicket]);
    setDoc(doc(db, `tickets_${selectedProject.toLowerCase()}`, id), newTicket);
    setTicketCounter(n => n + 1);
    
    if (newTicket.assignee) {
      const u = members.find(m => m.id === newTicket.assignee);
      if (u?.email) {
        fetch("/api/send-email", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({
          to: u.email, subject: `New Assignment: ${id}`, text: `You've been assigned ticket ${id}: ${newTicket.title}`
        })}).catch(() => {});
      }
    }
  }, [selectedProject, ticketCounter, members]);

  return { tickets, members, moveTicket, saveTicket, deleteTicket, createTicket };
}
