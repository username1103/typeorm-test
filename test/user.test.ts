import { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../src/data-source";
import { Director } from "../src/entity/Director";
import { Team } from "../src/entity/Team";
import { User } from "../src/entity/User";
import { UserRemoveCascade } from "../src/entity/UserRemoveCascade";

describe("영속성 테스트", () => {
  let DataSource: DataSource;
  let UserRepository: Repository<User>;
  let TeamRepository: Repository<Team>;
  let UserRemoveCascadeRepository: Repository<UserRemoveCascade>;

  beforeEach(async () => {
    DataSource = await AppDataSource.initialize();
    UserRepository = DataSource.getRepository(User);
    TeamRepository = DataSource.getRepository(Team);
    UserRemoveCascadeRepository = DataSource.getRepository(UserRemoveCascade);
  });

  afterEach(async () => {
    await DataSource.destroy();
  });

  describe("하나의 엔티티 대상 테스트", () => {
    test("새로운 엔티티 생성 후, save시 기존 엔티티가 업데이트 되는가", async () => {
      // given
      const user = new User();
      user.name = "myeongil";

      // when
      await UserRepository.save(user);

      // then
      expect(user.id).toBeDefined();
    });

    test("새로운 엔티티 생성 후, insert시 기존 엔티티가 업데이트 되는가", async () => {
      // given
      const user = new User();
      user.name = "myeongil";

      // when
      await UserRepository.insert(user);

      // then
      expect(user.id).toBeDefined();
    });

    test("다른 트랜잭션에서 새로운 엔티티 생성 후, 같은 엔티티를 select로 얻어온 경우, 엔티티는 서로 다른가", async () => {
      // given
      const user = new User();
      user.name = "test";

      // when
      await UserRepository.save(user);

      const savedUser = await UserRepository.findOneBy({ id: user.id });

      // then
      expect(user === savedUser).toBe(false);
    });

    test("같은 트랜잭션에서 새로운 엔티티 생성 후, 같은 엔티티를 select로 얻어온 경우, 엔티티는 서로 다른가", async () => {
      // given
      const user = new User();
      user.name = "test";

      // when
      // 같은 트랜잭션에서 save후 select하더라도 새롭게 쿼리가 나감.
      const qr = DataSource.createQueryRunner();

      await qr.startTransaction();

      await qr.manager.withRepository(UserRepository).save(user);
      const savedUser = await qr.manager
        .withRepository(UserRepository)
        .findOneBy({ id: 1 });

      await qr.commitTransaction();

      // then
      expect(user === savedUser).toBe(false);
    });

    test("같은 트랜잭션에서 같은 select 쿼리를 날리는 경우, 가져온 엔티티는 서로 다른가", async () => {
      // given
      const user = new User();
      user.name = "test";
      await UserRepository.save(user);

      // when
      const qr = DataSource.createQueryRunner();

      await qr.startTransaction();

      const savedUser = await qr.manager
        .withRepository(UserRepository)
        .findOneBy({ id: user.id });
      const savedUser2 = await qr.manager
        .withRepository(UserRepository)
        .findOneBy({ id: user.id });

      await qr.commitTransaction();

      // then
      expect(savedUser2 === savedUser).toBe(false);
    });
  });

  describe("연관관계 관련 테스트", () => {
    test("연관된 객체 지연 조회후 재조회시, 두 객체는 서로 같은가", async () => {
      // given
      const team = new Team();
      team.name = "TEST";
      await TeamRepository.save(team);
      const user = new User();
      user.name = "test";
      user.team = Promise.resolve(team);
      await UserRepository.save(user);
      const savedUser = await UserRepository.findOneBy({ id: user.id });
      // when
      const getUserTeam = await savedUser.team;
      const getUserTeam2 = await savedUser.team;
      // then
      expect(getUserTeam === getUserTeam2).toBe(true);
    });
    test("cascade가 true이고 insert시 연관객체는 저장이 안되는가", async () => {
      // given
      const team = new Team();
      team.name = "test";
      const user = new User();
      user.name = "kim";
      user.team = Promise.resolve(team);
      // when
      await UserRepository.insert(user);
      // then
      expect(team.id).toBeUndefined();
    });
    test("cascade가 true이고 save시 연관객체가 자동으로 저장되는가", async () => {
      // given
      const team = new Team();
      team.name = "test";
      const user = new User();
      user.name = "kim";
      user.team = Promise.resolve(team);
      // when
      await UserRepository.save(user);
      // then
      expect(team.id).toBeDefined();
    });
    test("cascade가 true이고 연관객체 수정후 save시 연관객체가 자동으로 수정되는가", async () => {
      // given
      const team = new Team();
      team.name = "test";
      const user = new User();
      user.name = "kim";
      user.team = Promise.resolve(team);
      await UserRepository.save(user);
      // when
      (await user.team).name = "test2";
      await UserRepository.save(user);
      // then
      expect(team.id).toBeDefined();
      expect(team.name).toEqual("test2");
    });
    test('cascade = ["insert"]일때, save시 연관객체가 연쇄적으로 저장되는가', async () => {
      // given
      const user = new User();
      user.name = "test";

      const team = new Team();
      team.name = "team1";

      user.team = Promise.resolve(team);

      const director = new Director();
      director.name = "director1";

      team.director = Promise.resolve(director);

      // when
      await UserRepository.save(user);

      // then
      expect(user.id).toBeDefined();
      expect(team.id).toBeDefined();
      expect(director.id).toBeDefined();
    });
    test("cascade가 ['remove']이고 remove시 연관객체가 삭제되는가", async () => {
      // given
      const team = new Team();
      team.name = "test";
      await TeamRepository.save(team);
      const user = new UserRemoveCascade();
      user.name = "kim";
      user.team = Promise.resolve(team);
      await UserRemoveCascadeRepository.save(user);
      expect(team.id).toBeDefined();
      // when
      await UserRemoveCascadeRepository.remove(user);
      // then
      const savedTeam = await TeamRepository.findOneBy({ id: team.id });
      expect(savedTeam).toBeUndefined();
    });
  });
});
