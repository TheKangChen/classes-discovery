import Image from "next/image";
import Search from "@/app/ui/search";
import { Card } from "@/app/ui/cards";
import { Suspense } from "react";

export default function Page() {
    return (
        <main className="">
            <div className="">
                <div className="">
                    <div>
                        <h1 className="">
                            Technology Classes Discovery
                        </h1>
                    </div>
                    <div className="">
                        <Search placeholder="Search classes" />
                    </div>
                </div>
                <br />
                <hr />
                <br />
                <div>
                    <Card
                        title="Fundamentals of programming with Python part 1"
                        description="Sed quis esse aut neque. Commodi fugiat maxime corrupti. Inventore amet quia rerum vero esse a voluptatem. Quis error voluptatem consequatur iusto quasi sit. Et quam optio atque ut incidunt enim asperiores quis. Excepturi excepturi cupiditate cupiditate officiis eius non."
                        level="Intermediate"
                    />
                </div>
            </div>
        </main>
    );
}
