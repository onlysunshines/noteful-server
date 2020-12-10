TRUNCATE folder, note RESTART IDENTITY CASCADE;

INSERT INTO folder (folder_name)
VALUES
  ('Important'), ('Super'), ('Spangley');

INSERT INTO note (note_name, modified, folder_id, content)
VALUES (
      'Dogs',
      now(),
      2,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    ),
    (
      'Cats',
      now(),
      1,
      'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness.'
    ),
    (
      'Pigs',
      now(),
      1,
      'No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.'
    ),
    (
      'Birds',
      now(),
      2,
      'Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.'
    ),
    (
      'Bears',
      now(),
      2,
      'To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it?'
    ),
    (
      'Horses',
      now(),
      1,
      null
    ),
    (
      'Tigers',
      now(),
      3,
      'But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?'
    ),
    (
      'Wolves',
      now(),
      3,
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. '
    ),
    (
      'Elephants',
      now(),
      1,
      'kafgwkfwegefaw'
    ),
    (
      'Lions',
      now(),
      2,
      'hi a note'
    ),
    (
      'Monkeys',
      now(),
      3,
      'starter, testing!'
    ),
    (
      'Bats',
      now(),
      2,
      'Hey batter batter'
    ),
    (
      'Turtles',
      now(),
      1,
      'tune into the frequency of love'
    ),
    (
      'Zebras',
      now(),
      1,
      'better to rest on Monday than spend the rest of the week debugging Monday''s code'
    );