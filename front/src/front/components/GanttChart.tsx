import React from 'react';
import styled from 'styled-components';
import { Task } from '../services/taskService';

interface GanttChartProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const GanttContainer = styled.div`
  background-color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.card};
  overflow-x: auto;
`;

const GanttTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
`;

const TableHeader = styled.thead`
  background-color: ${props => props.theme.colors.gray[50]};
  border-bottom: 2px solid ${props => props.theme.colors.gray[200]};
`;

const HeaderRow = styled.tr``;

const HeaderCell = styled.th`
  padding: ${props => props.theme.spacing.md};
  text-align: left;
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.gray[700]};
  font-size: ${props => props.theme.fontSize.sm};
  border-right: 1px solid ${props => props.theme.colors.gray[200]};
  
  &:first-child {
    min-width: 250px;
  }
  
  &:nth-child(2), &:nth-child(3) {
    min-width: 120px;
  }
  
  &:nth-child(4) {
    min-width: 100px;
  }
`;

const TimelineHeader = styled.th<{ $colspan: number }>`
  padding: ${props => props.theme.spacing.md};
  text-align: center;
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.gray[700]};
  font-size: ${props => props.theme.fontSize.sm};
  border-right: 1px solid ${props => props.theme.colors.gray[200]};
`;

const MonthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

const MonthLabel = styled.div`
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.gray[800]};
`;

const WeekLabels = styled.div`
  display: flex;
  gap: 2px;
  flex: 1;
  justify-content: space-around;
`;

const WeekLabel = styled.div`
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.gray[600]};
  min-width: 40px;
  text-align: center;
`;

const TableBody = styled.tbody``;

const TaskRow = styled.tr<{ $isParent: boolean; $indent: number }>`
  background-color: ${props => props.$isParent ? props.theme.colors.gray[50] : 'transparent'};
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.gray[100]};
  }
`;

const TaskCell = styled.td`
  padding: ${props => props.theme.spacing.md};
  border-right: 1px solid ${props => props.theme.colors.gray[100]};
  vertical-align: middle;
`;

const TaskNameCell = styled(TaskCell)<{ $indent: number }>`
  padding-left: ${props => props.theme.spacing.md + props.$indent * 24}px;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.gray[800]};
`;

const DateCell = styled(TaskCell)`
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.theme.colors.gray[600]};
  white-space: nowrap;
`;

const StatusCell = styled(TaskCell)`
  font-size: ${props => props.theme.fontSize.xs};
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.sm}`};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeight.medium};
  font-size: ${props => props.theme.fontSize.xs};
  background-color: ${props => {
    if (props.$status === 'completed') return '#E3F2FD'; // light blue
    if (props.$status === 'in_progress') return '#1976D2'; // dark blue
    if (props.$status === 'pending') return '#B71C1C'; // maroon
    if (props.$status === 'cancelled') return '#E0E0E0'; // light gray
    return props.theme.colors.gray[200];
  }};
  color: ${props => {
    if (props.$status === 'completed') return '#1976D2';
    if (props.$status === 'in_progress') return props.theme.colors.white;
    if (props.$status === 'pending') return props.theme.colors.white;
    if (props.$status === 'cancelled') return props.theme.colors.gray[600];
    return props.theme.colors.gray[700];
  }};
`;

const TimelineCell = styled(TaskCell)`
  padding: ${props => props.theme.spacing.sm};
  position: relative;
  height: 40px;
`;

const GanttBar = styled.div<{ $start: number; $width: number; $status: string; $progress: number }>`
  position: absolute;
  left: ${props => props.$start}%;
  width: ${props => props.$width}%;
  height: 28px;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => {
    if (props.$status === 'completed') return '#64B5F6'; // light blue
    if (props.$status === 'in_progress') return '#1976D2'; // dark blue
    if (props.$status === 'pending') return '#B71C1C'; // maroon
    if (props.$status === 'cancelled') return '#E0E0E0'; // light gray
    return props.theme.colors.gray[300];
  }};
  border: 1px solid ${props => {
    if (props.$status === 'completed') return '#42A5F5';
    if (props.$status === 'in_progress') return '#1565C0';
    if (props.$status === 'pending') return '#C62828';
    if (props.$status === 'cancelled') return '#BDBDBD';
    return props.theme.colors.gray[400];
  }};
  display: flex;
  align-items: center;
  padding: 0 ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSize.xs};
  color: ${props => props.$status === 'in_progress' || props.$status === 'pending' ? props.theme.colors.white : props.theme.colors.gray[800]};
  font-weight: ${props => props.theme.fontWeight.semibold};
  overflow: hidden;
  white-space: nowrap;
  top: 50%;
  transform: translateY(-50%);
`;

const ProgressOverlay = styled.div<{ $progress: number }>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${props => props.$progress}%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: ${props => props.theme.borderRadius.md};
  pointer-events: none;
`;

const ExpandIcon = styled.span<{ $expanded: boolean }>`
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.gray[500]};
  transform: rotate(${props => props.$expanded ? '90deg' : '0deg'});
  transition: transform 0.2s;
  font-size: ${props => props.theme.fontSize.xs};
`;

const ProgressText = styled.span`
  position: relative;
  z-index: 1;
  margin-left: auto;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['2xl']};
  color: ${props => props.theme.colors.gray[500]};
`;

const statusLabels: Record<string, string> = {
  pending: '대기',
  in_progress: '진행',
  completed: '완료',
  cancelled: '보류',
};

const GanttChart: React.FC<GanttChartProps> = ({ tasks, onTaskClick }) => {
  const [expandedTasks, setExpandedTasks] = React.useState<Set<number>>(new Set());

  // 날짜 범위 계산 (월 단위)
  const getDateRange = () => {
    if (tasks.length === 0) {
      const today = new Date();
      return { min: today, max: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000) };
    }

    const dates: Date[] = [];
    const collectDates = (task: Task) => {
      if (task.start_date) dates.push(new Date(task.start_date));
      if (task.end_date) dates.push(new Date(task.end_date));
      if (task.due_date) dates.push(new Date(task.due_date));
      if (task.children) {
        task.children.forEach(collectDates);
      }
    };
    tasks.forEach(collectDates);

    if (dates.length === 0) {
      const today = new Date();
      return { min: today, max: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000) };
    }

    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // 월의 첫날로 정렬
    minDate.setDate(1);
    maxDate.setMonth(maxDate.getMonth() + 1);
    maxDate.setDate(0);

    return { min: minDate, max: maxDate };
  };

  const { min, max } = getDateRange();

  // 월별 주차 계산 (월의 첫날부터 마지막날까지의 주차 수)
  const getWeeksInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 첫날이 속한 주의 시작일 (일요일)
    const firstSunday = new Date(firstDay);
    firstSunday.setDate(firstDay.getDate() - firstDay.getDay());
    
    // 마지막날이 속한 주의 시작일 (일요일)
    const lastSunday = new Date(lastDay);
    lastSunday.setDate(lastDay.getDate() - lastDay.getDay());
    
    // 주차 수 계산
    const diffTime = lastSunday.getTime() - firstSunday.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;
    
    return Math.max(5, diffWeeks); // 최소 5주
  };

  // 타임라인 헤더 생성
  const generateTimelineHeaders = () => {
    const headers: Array<{ month: number; year: number; weeks: number }> = [];
    const current = new Date(min);
    current.setDate(1); // 월의 첫날로 설정
    
    while (current <= max) {
      const year = current.getFullYear();
      const month = current.getMonth();
      const weeks = getWeeksInMonth(year, month);
      headers.push({ month, year, weeks });
      current.setMonth(month + 1);
    }
    
    return headers;
  };

  const timelineHeaders = generateTimelineHeaders();
  const totalWeeks = timelineHeaders.reduce((sum, h) => sum + h.weeks, 0);

  // 날짜를 주차 위치로 변환 (월의 첫날 기준)
  const getWeekPosition = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthStart = new Date(year, month, 1);
    
    // 해당 월의 첫날부터의 주차 계산
    const firstSunday = new Date(monthStart);
    firstSunday.setDate(monthStart.getDate() - monthStart.getDay());
    
    const diffTime = date.getTime() - firstSunday.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekInMonth = Math.floor(diffDays / 7);
    
    // 이전 월들의 주차 수 합산
    let weekOffset = 0;
    for (const header of timelineHeaders) {
      if (header.year === year && header.month === month) {
        break;
      }
      weekOffset += header.weeks;
    }
    
    return weekOffset + weekInMonth;
  };

  const getTaskPosition = (task: Task) => {
    if (!task.start_date || !task.end_date) {
      return { start: 0, width: 0 };
    }

    const startDate = new Date(task.start_date);
    const endDate = new Date(task.end_date);
    const startWeek = getWeekPosition(startDate);
    const endWeek = getWeekPosition(endDate);
    const duration = Math.max(1, endWeek - startWeek + 1);

    return {
      start: (startWeek / totalWeeks) * 100,
      width: (duration / totalWeeks) * 100,
    };
  };

  const toggleExpand = (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\./g, '-').replace(/\s/g, '').slice(0, -1);
  };

  const renderTask = (task: Task, indent: number = 0): React.ReactNode => {
    const hasChildren = task.children && task.children.length > 0;
    const isExpanded = expandedTasks.has(task.id);
    const position = getTaskPosition(task);

    return (
      <React.Fragment key={task.id}>
        <TaskRow
          $isParent={indent === 0}
          $indent={indent}
          onClick={() => onTaskClick?.(task)}
        >
          <TaskNameCell $indent={indent}>
            {hasChildren && (
              <ExpandIcon
                $expanded={isExpanded}
                onClick={(e) => toggleExpand(task.id, e)}
              >
                ▶
              </ExpandIcon>
            )}
            {!hasChildren && <span style={{ width: '20px' }} />}
            <span>{task.title}</span>
            {task.children_count && task.children_count > 0 && (
              <span style={{ fontSize: '0.75rem', color: '#666', marginLeft: '4px' }}>
                ({task.children_count})
              </span>
            )}
          </TaskNameCell>
          <DateCell>{formatDate(task.start_date)}</DateCell>
          <DateCell>{formatDate(task.end_date)}</DateCell>
          <StatusCell>
            <StatusBadge $status={task.status}>
              {statusLabels[task.status] || task.status}
            </StatusBadge>
          </StatusCell>
          <TimelineCell>
            {task.start_date && task.end_date && position.width > 0 && (
              <GanttBar
                $start={position.start}
                $width={position.width}
                $status={task.status}
                $progress={task.progress}
              >
                <ProgressOverlay $progress={task.progress} />
                <ProgressText>{task.progress}%</ProgressText>
              </GanttBar>
            )}
          </TimelineCell>
        </TaskRow>
        {hasChildren && isExpanded && task.children?.map(child => renderTask(child, indent + 1))}
      </React.Fragment>
    );
  };

  if (tasks.length === 0) {
    return (
      <GanttContainer>
        <EmptyState>표시할 업무가 없습니다.</EmptyState>
      </GanttContainer>
    );
  }

  return (
    <GanttContainer>
      <GanttTable>
        <TableHeader>
          <HeaderRow>
            <HeaderCell>업무명</HeaderCell>
            <HeaderCell>시작일</HeaderCell>
            <HeaderCell>종료일</HeaderCell>
            <HeaderCell>구분</HeaderCell>
            {timelineHeaders.map((header, idx) => (
              <TimelineHeader
                key={`${header.year}-${header.month}`}
                $colspan={header.weeks}
              >
                <MonthHeader>
                  <MonthLabel>
                    {header.year}년 {header.month + 1}월
                  </MonthLabel>
                  <WeekLabels>
                    {Array.from({ length: header.weeks }, (_, i) => (
                      <WeekLabel key={i}>{i + 1}주</WeekLabel>
                    ))}
                  </WeekLabels>
                </MonthHeader>
              </TimelineHeader>
            ))}
          </HeaderRow>
        </TableHeader>
        <TableBody>
          {tasks.map(task => renderTask(task))}
        </TableBody>
      </GanttTable>
    </GanttContainer>
  );
};

export default GanttChart;
