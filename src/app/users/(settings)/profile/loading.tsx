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
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-2/12" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-2/12" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-2/12" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
              <div className="grid w-2/4 gap-2">
                <Skeleton className="h-4 w-2/12" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-8 w-1/12" />
          </CardFooter>
        </Card>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-2/12" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[100px] w-[100px] rounded-full" />
          </CardContent>
          <CardFooter>
            <div className="flex gap-2">
              <Skeleton className="h-[40px] w-[58px]" />
              <Skeleton className="h-[40px] w-[85px]" />
            </div>
          </CardFooter>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-2/12" />
            </CardTitle>
            <CardDescription className="grid gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[20%]" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[40px] w-[160px]" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
