import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../src/data-source";
import { TeamNoRelation } from "../src/entity/TeamNoRelation";
import { UserNoRelation } from "../src/entity/UserNoRelation";

describe("Select Test", () => {
  describe("raw 조회", () => {
    let dataSource: DataSource;
    let userRepository: Repository<UserNoRelation>;
    let teamRepository: Repository<TeamNoRelation>;

    beforeAll(async () => {
      dataSource = await AppDataSource.initialize();
    });

    beforeEach(async () => {
      userRepository = dataSource.getRepository(UserNoRelation);
      teamRepository = dataSource.getRepository(TeamNoRelation);
      await userRepository.delete({});
      await teamRepository.delete({});
    });

    afterAll(async () => {
      await dataSource.destroy();
    });

    test("raw데이터 조회 결과", async () => {
      // given
      const team = new TeamNoRelation();
      team.name = "team1";
      await teamRepository.save(team);

      const user = new UserNoRelation();
      user.name = "test";
      user.teamId = team.id;
      await userRepository.save(user);

      // when
      const result = await userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect(TeamNoRelation, "team", "team.id = user.teamId")
        .where("user.id = :id", { id: user.id })
        .getRawMany();
      // then

      expect(result[0]).toBeDefined();
      expect(result[0]).toMatchObject({
        user_id: user.id,
        user_name: "test",
        user_teamId: team.id,
        team_id: team.id,
        team_name: "team1",
      });
    });

    test("연관관계 없는 엔티티 조인 조회 결과", async () => {
      // given
      const team = new TeamNoRelation();
      team.name = "team1";
      await teamRepository.save(team);

      const user = new UserNoRelation();
      user.name = "test";
      user.teamId = team.id;
      await userRepository.save(user);

      // when
      const result = await userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect(TeamNoRelation, "team", "team.id = user.teamId")
        .where("user.id = :id", { id: user.id })
        .getMany();

      // then
      expect(result[0]).toBeDefined();
      expect(result[0]).toMatchObject({
        id: user.id,
        name: "test",
        teamId: team.id,
      });
    });
  });
});
