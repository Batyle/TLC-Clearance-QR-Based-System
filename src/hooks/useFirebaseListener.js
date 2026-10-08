import { useEffect, useState } from "react";
import { getStudent, watchStudent } from "../services/clearanceService";
export default function useFirebaseListener(studentId) { const [student, setStudent] = useState(null); useEffect(() => { if (!studentId) return undefined; const unsubscribe = watchStudent(studentId, setStudent); const interval = setInterval(() => getStudent(studentId).then(setStudent), 30000); return () => { unsubscribe(); clearInterval(interval); }; }, [studentId]); return student; }
