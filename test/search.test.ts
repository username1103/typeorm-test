import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../src/data-source";
import { Team } from "../src/entity/Team";
import { User } from "../src/entity/User";
import { UserRemoveCascade } from "../src/entity/UserRemoveCascade";

describe("탐색 테스트", () => {
  let dataSource: DataSource;
  let userRepository: Repository<User>;
  let teamRepository: Repository<Team>;
  let userRemoveCascadeRepository: Repository<UserRemoveCascade>;

  beforeAll(async () => {
    dataSource = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    userRepository = dataSource.getRepository(User);
    teamRepository = dataSource.getRepository(Team);
    userRemoveCascadeRepository = dataSource.getRepository(UserRemoveCascade);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  test("계속해서 왔다갔다 탐색하는 경우, 쿼리가 여러번 나가게 되는가", async () => {
    // given
    const team = new Team();
    team.name = "test";
    await teamRepository.save(team);
    const user = new UserRemoveCascade();
    user.name = "kim";
    user.team = Promise.resolve(team);
    await userRepository.save(user);

    // when
    const savedTeam = await teamRepository.findOne({ where: { id: team.id } });
    const savedUser = await savedTeam.user;
    const savedTeam2 = await savedUser[0].team;

    // then
    expect(savedTeam.id).toEqual(savedTeam2.id);
    expect(savedTeam.name).toEqual(savedTeam2.name);
    expect(savedTeam).not.toEqual(savedTeam2);
  });

  test("계속해서 왔다갔다 탐색하는 경우, 캐시적용시, 쿼리가 여러번 나가게 되는가", async () => {
    // given
    const team = new Team();
    team.name = "test";
    await teamRepository.save(team);
    const user = new UserRemoveCascade();
    user.name = "kim";
    user.team = Promise.resolve(team);
    await userRepository.save(user);

    // when
    const savedTeam = await teamRepository.findOne({ where: { id: team.id } });
    const savedUser = await savedTeam.user;
    const savedTeam2 = await savedUser[0].team;

    // then
    expect(savedTeam.id).toEqual(savedTeam2.id);
    expect(savedTeam.name).toEqual(savedTeam2.name);
    expect(savedTeam).not.toEqual(savedTeam2);
  });
});
