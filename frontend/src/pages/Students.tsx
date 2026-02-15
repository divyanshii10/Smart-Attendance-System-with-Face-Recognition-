import { useEffect, useState } from 'react';
import { Search, Filter, UserPlus, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, Pagination } from '../components/ui/Table';
import { studentsAPI, departmentsAPI } from '../services/api';
import { getDepartmentColor } from '../utils/helpers';
import type { Student, Department } from '../types';

const ITEMS_PER_PAGE = 10;

export const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, selectedDept, students]);

  const loadData = async () => {
    try {
      const [studentsData, deptsData] = await Promise.all([
        studentsAPI.getAll(),
        departmentsAPI.getAll()
      ]);
      setStudents(studentsData);
      setDepartments(deptsData);
      setFilteredStudents(studentsData);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDept) {
      filtered = filtered.filter((student) => student.department === selectedDept);
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns = [
    { header: 'Roll Number', accessor: 'rollNumber' },
    { header: 'Name', accessor: 'name' },
    {
      header: 'Department',
      accessor: 'department',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(value)}`}>
          {value}
        </span>
      )
    },
    { header: 'Year', accessor: 'year' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Actions',
      accessor: 'id',
      render: (value: string, row: Student) => (
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Eye className="w-4 h-4" />}
          onClick={() => console.log('View student:', row)}
        >
          View
        </Button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage student records</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<UserPlus className="w-5 h-5" />}
        >
          Add Student
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, roll number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {paginatedStudents.length} of {filteredStudents.length} students
          </p>
        </div>

        <Table columns={columns} data={paginatedStudents} />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>
    </div>
  );
};
