import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SimpleProgress } from './simple-progress';

interface CourseCardProps {
  title: string;
  professor: string;
  progress: number;
  completed: number;
  total: number;
}

export function CourseCard({ title, professor, progress, completed, total }: CourseCardProps) {
  return (
    <Card className="p-6 bg-white rounded-xl shadow-sm border-0 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-[#1F2937] mb-1">{title}</h3>
          <p className="text-sm text-[#6B7280]">{professor}</p>
        </div>

        <div className="space-y-2">
          <SimpleProgress value={progress} />
          <p className="text-xs text-[#6B7280]">
            {completed} of {total} lessons completed
          </p>
        </div>

        <Button
          className="w-full bg-[#065F46] hover:bg-[#047857] text-white font-medium rounded-lg"
        >
          Continue
        </Button>
      </div>
    </Card>
  );
}
