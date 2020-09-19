import * as Knex from "knex";

const nDaysFromNow = (days: number, hour: number): string => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  now.setHours(hour);
  now.setMinutes(0);
  const timestamp = now.toISOString().replace(/Z$/, "");
  return timestamp;
};

export async function seed(knex: Knex): Promise<void> {
  await knex("meets").del();

  await knex("meets").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      meetType: "hackMeet",
      title: "Animation Toys 2",
      description: "Building impressive portfolio projects with PaperJS.",
      instructions: "See https://sites.google.com/mintbean.io/2020-06-01-animation-toys/home",
      registerLink: "http://eventbrite.com",
      coverImageUrl: "https://www.grafik.com.au/wp-content/uploads/2019/06/think-design.png",
      startTime: "2020-09-30T13:00:00",
      endTime: "2020-09-30T17:00:00",
      createdAt: "2020-08-15",
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      meetType: "hackMeet",
      title: "Algolia gives you super powers 3",
      description: "Buiilding impressive portfolio projects with Algolia.",
      instructions: "See https://sites.google.com/mintbean.io/2020-06-03-algolia-gives-you-s/home",
      registerLink: "http://eventbrite.com",
      coverImageUrl: "https://i.pinimg.com/originals/9c/12/84/9c128435562961b0c9ff32d1072b6f80.png",
      startTime: "2020-10-15T13:00:00",
      endTime: "2020-10-15T17:00:00",
      createdAt: "2020-10-15",
    },
    {
      id: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
      meetType: "hackMeet",
      title: "Hack the Hack",
      description: "Building impressive portfolio projects with PaperJS.",
      instructions: "See https://sites.google.com/mintbean.io/2020-06-01-animation-toys/home",
      registerLink: "http://eventbrite.com",
      coverImageUrl:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
      startTime: nDaysFromNow(2, 12),
      endTime: nDaysFromNow(2, 16),
      createdAt: "2020-08-15",
    },
    {
      id: "87496d2d-ae36-4039-bd14-45bd0de3929c",
      meetType: "hackMeet",
      title: "Algolia gives you super powers 2",
      description: "Buiilding impressive portfolio projects with Algolia.",
      instructions: "See https://sites.google.com/mintbean.io/2020-06-03-algolia-gives-you-s/home",
      registerLink: "http://eventbrite.com",
      coverImageUrl: "https://i.pinimg.com/originals/9c/12/84/9c128435562961b0c9ff32d1072b6f80.png",
      startTime: nDaysFromNow(4, 12),
      endTime: nDaysFromNow(4, 16),
      createdAt: "2020-09-01",
    },
    {
      id: "e093af41-8238-4fd6-ae2e-145497c3e038",
      meetType: "hackMeet",
      title: "Animation Toys 1",
      description: "Building impressive portfolio projects with PaperJS.",
      instructions: "See https://sites.google.com/mintbean.io/2020-06-01-animation-toys/home",
      registerLink: "http://eventbrite.com",
      coverImageUrl: "https://www.grafik.com.au/wp-content/uploads/2019/06/think-design.png",
      startTime: "2020-09-10T13:00:00",
      endTime: "2020-09-10T17:00:00",
      createdAt: "2020-09-01",
    },
    {
      id: "5ba2fc6b-e910-43dc-8dbc-75acd139ecfa",
      meetType: "hackMeet",
      title: "Algolia gives you super powers",
      description: "Buiilding impressive portfolio projects with Algolia.",
      instructions: "See https://sites.google.com/mintbean.io/2020-06-03-algolia-gives-you-s/home",
      registerLink: "http://eventbrite.com",
      coverImageUrl: "https://i.pinimg.com/originals/9c/12/84/9c128435562961b0c9ff32d1072b6f80.png",
      startTime: "2020-09-10T13:00:00",
      endTime: "2020-09-10T17:00:00",
      createdAt: "2020-09-01",
    },
  ]);
}
