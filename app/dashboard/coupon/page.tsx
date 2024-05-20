import { Pen } from "lucide-react"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

import {db} from "@/lib/db"
import { CouponList } from "@/components/dashboard/coupon/coupon-list"

interface Props {
  searchParams: {
      status: string;
      page: string;
      perPage: string;
      search: string;
  }
};

const Coupon = async ({ searchParams }: Props) => {
    const {search, status} = searchParams
    const itemsPerPage = parseInt(searchParams.perPage) || 5;  
    const currentPage = parseInt(searchParams.page) || 1;

    const coupons = await db.coupon.findMany({
        where: {
            ...(search && {
                name: {
                    contains: search, mode: "insensitive"
                }
            }),
            ...(status !== "ALL" && {
                status: {
                    equals: status
                }
            })
        },
        orderBy: {
            createdAt: "desc"
        },
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    const totalCoupons = await db.coupon.count({
        where: {
            ...(search && {
                name: {
                    contains: search, mode: "insensitive"
                }
            }),
            ...(status && {
                status: {
                    equals: status
                }
            })
        }
    });

    const totalPage = Math.ceil(totalCoupons / itemsPerPage);

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbPage>Coupon</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Link href="/dashboard/coupon/create">
                    <Button size="sm" className="flex items-center gap-x-2">
                        <Pen className="w-5 h-5" />
                        Create
                    </Button>
                </Link>
            </div>
            <CouponList coupons={coupons} totalPage={totalPage} />
        </div>
    )
}

export default Coupon