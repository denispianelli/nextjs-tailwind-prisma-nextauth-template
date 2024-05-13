import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="grid gap-4">
              <Skeleton className="h-8 w-2/12" />
              <div className="grid gap-1">
                <Skeleton className="h-2 w-[10%]" />
                <Skeleton className="ml-4 h-2 w-[15%]" />
                <Skeleton className="ml-4 h-2 w-[15%]" />
                <Skeleton className="ml-4 h-2 w-[15%]" />
                <Skeleton className="ml-4 h-2 w-[15%]" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-96 gap-6">
              <div className="grid gap-2">
                <Skeleton className="h-4 w-2/12" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="grid w-96 gap-6">
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-2/12" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
              <div className="grid w-96 gap-6">
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-2/12" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-[65px]" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
