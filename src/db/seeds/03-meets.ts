import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("meets").del();

  await knex("meets").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      meetType: "hackMeet",
      title: "Animation Toys",
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
      title: "Algolia gives you super powers",
      description: "Buiilding impressive portfolio projects with Algolia.",
      instructions: "See https://sites.google.com/mintbean.io/2020-06-03-algolia-gives-you-s/home",
      registerLink: "http://eventbrite.com",
      coverImageUrl: "https://i.pinimg.com/originals/9c/12/84/9c128435562961b0c9ff32d1072b6f80.png",
      startTime: "2020-10-15T13:00:00",
      endTime: "2020-10-15T17:00:00",
      createdAt: "2020-10-15",
    },
  ]);
}
